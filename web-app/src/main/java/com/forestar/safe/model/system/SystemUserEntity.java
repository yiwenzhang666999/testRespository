package com.forestar.safe.model.system;

import com.forestar.core.util.StringUtils;
import com.forestar.data.general.GlobalDataType;
import com.forestar.data.general.RowBase;

public class SystemUserEntity extends RowBase<Object>
{
  private static final long serialVersionUID = 1L;
  public static final String FIELD_I_USERID = "I_USERID";
  public static final String FIELD_C_USERNAME = "C_USERNAME";
  public static final String FIELD_C_PWD = "C_PWD";
  public static final String FIELD_C_USEREALNAME = "C_USEREALNAME";
  public static final String FIELD_C_USERTEL = "C_USERTEL";
  public static final String FIELD_C_USEREMAIL = "C_USEREMAIL";
  public static final String FIELD_I_ORGID = "I_ORGID";
  public static final String FIELD_I_ORDER = "I_ORDER";
  public static final String FIELD_C_ZQCODE = "C_ZQCODE";
  
  public static final String FIELD_C_SFSH = "C_SFSH";
  public static final String FIELD_C_PARID = "C_PARID";
  public static final String FIELD_C_USERJB = "C_USERJB";

  public int getI_USERID()
  {
    return StringUtils.objectToInt(getValue(GlobalDataType.Int32, "I_USERID"));
  }

  public void setI_USERID(String value) {
    setValue("I_USERID", value);
  }

  public String getC_USERNAME()
  {
    Object obj = getValue(GlobalDataType.String, "C_USERNAME");
    if ((obj instanceof String)) {
      return (String)obj;
    }
    return (String)obj;
  }

  public void setC_USERNAME(String value)
  {
    setValue("C_USERNAME", value);
  }

  public String getC_PWD()
  {
    Object obj = getValue(GlobalDataType.String, "C_PWD");
    if ((obj instanceof String)) {
      return (String)obj;
    }
    return (String)obj;
  }

  public void setC_PWD(String value)
  {
    setValue("C_PWD", value);
  }

  public String getC_USEREALNAME()
  {
    Object obj = getValue(GlobalDataType.String, "C_USEREALNAME");
    if ((obj instanceof String)) {
      return (String)obj;
    }
    return (String)obj;
  }

  public void setC_USEREALNAME(String value)
  {
    setValue("C_USEREALNAME", value);
  }

  public String getC_USERTEL()
  {
    Object obj = getValue(GlobalDataType.String, "C_USERTEL");
    if ((obj instanceof String)) {
      return (String)obj;
    }
    return (String)obj;
  }

  public void setC_USERTEL(String value)
  {
    setValue("C_USERTEL", value);
  }

  public String getC_USEREMAIL()
  {
    Object obj = getValue(GlobalDataType.String, "C_USEREMAIL");
    if ((obj instanceof String)) {
      return (String)obj;
    }
    return (String)obj;
  }

  public void setC_USEREMAIL(String value)
  {
    setValue("C_USEREMAIL", value);
  }

  public int getI_ORGID()
  {
    return StringUtils.objectToInt(getValue(GlobalDataType.Int32, "I_ORGID"));
  }

  public void setI_ORGID(String value) {
    setValue("I_ORGID", value);
  }

  public int getI_ORDER()
  {
    return StringUtils.objectToInt(getValue(GlobalDataType.Int32, "I_ORDER"));
  }

  public void setI_ORDER(String value) {
    setValue("I_ORDER", value);
  }

  public String getZqCode()
  {
    Object obj = getValue(GlobalDataType.String, "C_ZQCODE");
    if ((obj instanceof String)) {
      return (String)obj;
    }
    return (String)obj;
  }

  public void setZqCode(String value)
  {
    setValue("C_ZQCODE", value);
  }
  
  public String getC_SFSH()
  {
    Object obj = getValue(GlobalDataType.String, "C_SFSH");
    if ((obj instanceof String)) {
      return (String)obj;
    }
    return (String)obj;
  }

  public void setC_SFSH(String value)
  {
    setValue("C_SFSH", value);
  }
  public String getC_PARID()
  {
    Object obj = getValue(GlobalDataType.String, "C_PARID");
    if ((obj instanceof String)) {
      return (String)obj;
    }
    return (String)obj;
  }

  public void setC_PARID(String value)
  {
    setValue("C_PARID", value);
  }
  public String getC_USERJB()
  {
    Object obj = getValue(GlobalDataType.String, "C_USERJB");
    if ((obj instanceof String)) {
      return (String)obj;
    }
    return (String)obj;
  }

  public void setC_USERJB(String value)
  {
    setValue("C_USERJB", value);
  }
}