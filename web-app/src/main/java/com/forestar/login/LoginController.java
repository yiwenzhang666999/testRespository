/**
 * 
 */
package com.forestar.login;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jasig.cas.client.validation.Assertion;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.forestar.core.Config;
import com.forestar.core.exception.AuthenticationException;
import com.forestar.core.exception.WithoutPermissionException;
import com.forestar.core.session.CurrentSessionHelper;
import com.forestar.core.session.SessionFactory;
import com.forestar.core.util.StringUtils;
import com.forestar.data.general.QueryFilter;
import com.forestar.data.general.RowBase;
import com.forestar.joint.resouces.model.FunctionDataModel;
import com.forestar.joint.resouces.model.UserDataModel;
import com.forestar.safe.login.LoginBase;
import com.forestar.safe.login.SessionInfo;
import com.forestar.util.Util;

/**
 * @author wy
 *
 */
@Controller
public class LoginController extends LoginBase {

	// ------------------------------------------------------------------------------
	//
	// Spring Security框架
	//
	// ------------------------------------------------------------------------------
	/**
	 * 
	 * <p>
	 * 集成 Spring Security的登出功能
	 * </p>
	 * 
	 * @param req
	 * @param resp
	 * @param model
	 * @return String
	 * @throws Exception
	 */
	@RequestMapping(value = "/logout.do")
	public String logout(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		Assertion assertion = (Assertion) request.getSession().getAttribute("_const_cas_assertion_");
		if (assertion != null) {
			request.getSession().invalidate();
			this.resoucesClient.cleanModel();
		}
		request.getSession().invalidate();
		this.resoucesClient.cleanModel();
		String logout = Config.getValue("cas.server") + "/logout";
		String url = request.getRequestURL().toString().replace("/logout.do", "/login.do");
		return "redirect:" + logout + "?service=" + url;
	}

	/**
	 * 
	 * <p>
	 * 集成 Spring Security的登录功能
	 * </p>
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @throws Exception
	 */
	@RequestMapping(value = "/login.do")
	public String login(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		// super.changeResources(model, request);
		/*
		 * if(1==1){ return "/index"; }
		 */
		try {
			Boolean bool = validationCasRequest(request);

			UserDataModel userEntity = (UserDataModel) SessionFactory.getSession().getObject("UserEntity");
			String userId = userEntity.getUserid();
			String sql = "select C_SYSBH FROM FS_YW_SYSTEM_INFO WHERE I_SYSTEMID "
					+ "IN (SELECT I_SYSTEMID FROM FS_YW_SYSTEM_ROLE WHERE I_ROLEID"
					+ " IN (SELECT I_ROLEID FROM FS_YW_USER_ROLE WHERE I_USERID = '" + userId + "'))";
			List<RowBase> list = baseService.getDataTableSql("FS_YW_SYSTEM_INFO", sql, null);
			boolean validate = false;
			if (null != list && list.size() > 0) {
				for (RowBase row : list) {
					String sysBh = row.getOriginalObjects().get("C_SYSBH").toString();
					if (sysBh.equals("ZYJG")) {
						validate = true;
						break;
					}
				}
			}
			if (validate) {
				return "forward:/index.do";
			} else {
				return "/error/permissionsException";
			}
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 
	 * <p>
	 * 跳转首页页面
	 * </p>
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @throws Exception
	 */
	@RequestMapping(value = "/index.do")
	public String index(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		// TODO 增加业务功能
		loginLog(request); // 登录日志
		// 权限过滤
		try {
			changeResources(model, request);
			if (request.getSession().getAttribute("zqCode") != null) {
				return "/index";
			}
			// TODO 增加业务功能
			// loginLog(request); // 登录日志
			// 权限过滤
			UserDataModel userEntity = (UserDataModel) SessionFactory.getSession().getObject("UserEntity");
			String userId = userEntity.getUserid();
			// 设置过滤条件
			QueryFilter qf = new QueryFilter();
			qf.setIsAddSecurityFilter(true);
			qf.setWhereString("I_USERID ='" + userId + "'");
			qf.setSelectFields("C_ZQCODE,C_USERJB");
			qf.setAddCaptionField(true);
			List<RowBase> list = baseService.getEntityList("FS_YW_BASE_USER", qf);
			String c_zqcode = list.get(0).getOriginalObjects().get("C_ZQCODE").toString();
			String c_userjb = list.get(0).getOriginalObjects().get("C_USERJB").toString();
			// 将政区、级别 放到 SessionFactory 中方便 后台调用
			SessionFactory.getSession().setObject("zqCode", c_zqcode);
			SessionFactory.getSession().setObject("userJb", c_userjb);
			SessionFactory.getSession().setObject("defineNd", Util.getDefineND());
		} catch (AuthenticationException ex) {
			String login = Config.getValue("cas.server") + "/login";
			String url = request.getRequestURL().toString();
			return "redirect:" + login + "?service=" + url;
		}
		return "/index";
	}

	/**
	 * 
	 * <p>
	 * 跳转制图页面
	 * </p>
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @throws Exception
	 */
	@RequestMapping(value = "/zyjgZt.do")
	public String zyjgZt(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		// String
		// base64url="data:image/jpeg;base64,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";
		String base64url = request.getParameter("base64url");
		// TODO 增加业务功能
		loginLog(request); // 登录日志
		// 权限过滤
		// changeResources(model, request);
		request.setAttribute("base64url", base64url);
		return "/module/printMap/zyjg-zt";
	}

	/**
	 * 
	 * <p>
	 * 跳转制图页面
	 * </p>
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 * @throws Exception
	 */
	@RequestMapping(value = "/zyjgMap.do")
	public String zyjgMap(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		String base64url = request.getParameter("base64url");
		// TODO 增加业务功能
		loginLog(request); // 登录日志
		// 权限过滤
		changeResources(model, request);
		String zqCode = SessionFactory.getSession().getObject("zqCode").toString();
		String userJb = SessionFactory.getSession().getObject("userJb").toString();
		request.setAttribute("base64url", base64url);
		request.setAttribute("zqCode", zqCode);
		request.setAttribute("userJb", userJb);
		return "/module/printMap/zyjgMap";
	}

	/**
	 * 通过cas链接其他网站
	 * 
	 * @param request
	 * @param response
	 * @param key
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/router.web")
	public String ldbg(HttpServletRequest request, HttpServletResponse response, String key) throws Exception {
		try {
			String target = Config.getValue(key);
			// return "redirect:"+cas+"?service="+target;
			return "redirect:" + target;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	protected void changeResources(Model model, HttpServletRequest req)
			throws Exception, WithoutPermissionException, IOException {
		UserDataModel userEntity = (UserDataModel) SessionFactory.getSession().getObject("UserEntity");
		if (userEntity == null) {
			throw new AuthenticationException("用户失效,请重新登录！");
		}
		model.addAttribute(SessionInfo.realName, userEntity.getRealname());
		model.addAttribute(SessionInfo.userId, userEntity.getUserid());
		model.addAttribute(SessionInfo.orgId, userEntity.getOrgid());
		model.addAttribute(SessionInfo.orgName, userEntity.getOrgName());
		model.addAttribute(SessionInfo.userName, userEntity.getUsername());
		model.addAttribute(SessionInfo.onlineUser, Integer.valueOf(CurrentSessionHelper.getOnlineUserCount()));
		model.addAttribute(SessionInfo.superUser, Boolean.valueOf(false));
		if (userEntity.getUsername().equals(Config.getSupername())) {
			model.addAttribute(SessionInfo.superUser, Boolean.valueOf(true));
		}

		List<FunctionDataModel> functions = (List) SessionFactory.getSession().getObject("Function");

		List<String> validFuns = new ArrayList();
		if ((functions != null) && (functions.size() > 0)) {
			for (int i = 0; i < functions.size(); i++) {
				FunctionDataModel fmodel = (FunctionDataModel) functions.get(i);
				String funMark = fmodel.getBh();
				String state = fmodel.getState();
				if (("0".equals(state)) && (!StringUtils.isEmpty(funMark))) {
					validFuns.add(funMark);
				}
			}
			if (!model.containsAttribute(SessionInfo.functions)) {
				model.addAttribute(SessionInfo.functions, validFuns.toString());
			}
			model.addAttribute("functionStr",model.asMap().get("functions").toString());
		}
	}
	
	@RequestMapping(value = "/testAjax.do")@ResponseBody
	public String testAjax() throws Exception {
//		System.out.println("访问了testAjax");
		return "yes";
	}
}
