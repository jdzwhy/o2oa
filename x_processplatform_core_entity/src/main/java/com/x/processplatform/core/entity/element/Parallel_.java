/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.processplatform.core.entity.element;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.Boolean;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.processplatform.core.entity.element.Parallel.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Sat May 06 19:36:06 CST 2017")
public class Parallel_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<Parallel,String> afterArriveScript;
    public static volatile SingularAttribute<Parallel,String> afterArriveScriptText;
    public static volatile SingularAttribute<Parallel,String> afterExecuteScript;
    public static volatile SingularAttribute<Parallel,String> afterExecuteScriptText;
    public static volatile SingularAttribute<Parallel,String> afterInquireScript;
    public static volatile SingularAttribute<Parallel,String> afterInquireScriptText;
    public static volatile SingularAttribute<Parallel,String> alias;
    public static volatile SingularAttribute<Parallel,Boolean> allowReroute;
    public static volatile SingularAttribute<Parallel,Boolean> allowRerouteTo;
    public static volatile SingularAttribute<Parallel,String> beforeArriveScript;
    public static volatile SingularAttribute<Parallel,String> beforeArriveScriptText;
    public static volatile SingularAttribute<Parallel,String> beforeExecuteScript;
    public static volatile SingularAttribute<Parallel,String> beforeExecuteScriptText;
    public static volatile SingularAttribute<Parallel,String> beforeInquireScript;
    public static volatile SingularAttribute<Parallel,String> beforeInquireScriptText;
    public static volatile SingularAttribute<Parallel,Date> createTime;
    public static volatile SingularAttribute<Parallel,String> description;
    public static volatile SingularAttribute<Parallel,String> extension;
    public static volatile SingularAttribute<Parallel,String> form;
    public static volatile SingularAttribute<Parallel,String> id;
    public static volatile SingularAttribute<Parallel,String> name;
    public static volatile SingularAttribute<Parallel,String> position;
    public static volatile SingularAttribute<Parallel,String> process;
    public static volatile ListAttribute<Parallel,String> readDataPathList;
    public static volatile ListAttribute<Parallel,String> readDepartmentList;
    public static volatile SingularAttribute<Parallel,String> readDuty;
    public static volatile ListAttribute<Parallel,String> readIdentityList;
    public static volatile SingularAttribute<Parallel,String> readScript;
    public static volatile SingularAttribute<Parallel,String> readScriptText;
    public static volatile ListAttribute<Parallel,String> reviewDataPathList;
    public static volatile ListAttribute<Parallel,String> reviewDepartmentList;
    public static volatile SingularAttribute<Parallel,String> reviewDuty;
    public static volatile ListAttribute<Parallel,String> reviewIdentityList;
    public static volatile SingularAttribute<Parallel,String> reviewScript;
    public static volatile SingularAttribute<Parallel,String> reviewScriptText;
    public static volatile ListAttribute<Parallel,String> routeList;
    public static volatile SingularAttribute<Parallel,String> script;
    public static volatile SingularAttribute<Parallel,String> sequence;
    public static volatile SingularAttribute<Parallel,Date> updateTime;
}
