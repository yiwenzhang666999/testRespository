package com.forestar.cache.redis;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.forestar.cache.jobs.Job;
import com.forestar.core.spring.SpringBeanFactory;

@Controller
@RequestMapping("/test/")
public class TestController {
	@Autowired
	private IGeomOption opt;
	
	private String dataset_name = "360323";
	private String layer_name = "ZYJG_BHTB";
	
	@RequestMapping(value = "/getFeatures.web")
	@ResponseBody
	public Set<Feature> logout(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		long start = System.currentTimeMillis();
		String xmin = request.getParameter("xmin");
		String ymin = request.getParameter("ymin");
		String xmax = request.getParameter("xmax");
		String ymax = request.getParameter("ymax");
		GeomOptParams param = new GeomOptParams();
		param.setParam("xmin", xmin);
		param.setParam("ymin", ymin);
		param.setParam("xmax", xmax);
		param.setParam("ymax", ymax);
		Set<Feature> feature = opt.getFeature(dataset_name,layer_name,param);
		long end = System.currentTimeMillis();
		System.out.println("getFeatures方法用时:"+(end-start)+"ms");
		return feature;
	}
	
	@RequestMapping(value = "/addFeature.web")
	@ResponseBody
	public List<String> addFeature(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		long start = System.currentTimeMillis();
		List<GeomOptParams> params = JSONObject.parseArray(request.getParameter("param"), GeomOptParams.class);
		List<String> result = opt.addFeature(dataset_name,layer_name,params);
		long end = System.currentTimeMillis();
		System.out.println("getFeatures方法用时:"+(end-start)+"ms");
		return result;
	}
	
	@RequestMapping(value = "/delFeature.web")
	@ResponseBody
	public boolean delFeature(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		List<GeomOptParams> params = JSONObject.parseArray(request.getParameter("param"), GeomOptParams.class);
		return opt.deleteFeature(dataset_name,layer_name,params);
	}
	
	@RequestMapping(value = "/modifyFeature.web")
	@ResponseBody
	public boolean modifyFeature(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		long start = System.currentTimeMillis();
		List<GeomOptParams> params = JSONObject.parseArray(request.getParameter("param"), GeomOptParams.class);
		opt.updateFeature(dataset_name,layer_name,params);
		long end = System.currentTimeMillis();
		System.out.println("modifyFeature方法用时:"+(end-start)+"ms");
		return true;
	}
	
	@RequestMapping(value = "/multiOptFeature.web")
	@ResponseBody
	public List<JSONObject> multiOptFeature(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		long start = System.currentTimeMillis();
		List<GeomOptParams> params = JSONObject.parseArray(request.getParameter("param"), GeomOptParams.class);
		List<JSONObject> result = opt.multiOptFeature(dataset_name,layer_name,params);
		long end = System.currentTimeMillis();
		System.out.println("multiOptFeature方法用时:"+(end-start)+"ms");
		return result;
	}
	
	@RequestMapping(value = "/job1.web")
	@ResponseBody
	public boolean job1(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {
		Job job = (Job)SpringBeanFactory.getBean("redisSynchronizeDBJob");
		job.hanldeJob();
		return true;
	}
}
