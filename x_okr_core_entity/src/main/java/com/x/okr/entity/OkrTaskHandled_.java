/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.okr.entity;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.Long;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.okr.entity.OkrTaskHandled.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Sat May 06 19:35:29 CST 2017")
public class OkrTaskHandled_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<OkrTaskHandled,String> activityName;
    public static volatile SingularAttribute<OkrTaskHandled,Date> arriveDateTime;
    public static volatile SingularAttribute<OkrTaskHandled,String> arriveDateTimeStr;
    public static volatile SingularAttribute<OkrTaskHandled,String> centerId;
    public static volatile SingularAttribute<OkrTaskHandled,String> centerTitle;
    public static volatile SingularAttribute<OkrTaskHandled,Date> createTime;
    public static volatile SingularAttribute<OkrTaskHandled,Long> duration;
    public static volatile SingularAttribute<OkrTaskHandled,String> dynamicObjectId;
    public static volatile SingularAttribute<OkrTaskHandled,String> dynamicObjectTitle;
    public static volatile SingularAttribute<OkrTaskHandled,String> dynamicObjectType;
    public static volatile SingularAttribute<OkrTaskHandled,String> id;
    public static volatile SingularAttribute<OkrTaskHandled,Date> processDateTime;
    public static volatile SingularAttribute<OkrTaskHandled,String> processDateTimeStr;
    public static volatile SingularAttribute<OkrTaskHandled,String> processType;
    public static volatile SingularAttribute<OkrTaskHandled,String> sequence;
    public static volatile SingularAttribute<OkrTaskHandled,String> status;
    public static volatile SingularAttribute<OkrTaskHandled,String> targetCompanyName;
    public static volatile SingularAttribute<OkrTaskHandled,String> targetIdentity;
    public static volatile SingularAttribute<OkrTaskHandled,String> targetName;
    public static volatile SingularAttribute<OkrTaskHandled,String> targetOrganizationName;
    public static volatile SingularAttribute<OkrTaskHandled,String> title;
    public static volatile SingularAttribute<OkrTaskHandled,Date> updateTime;
    public static volatile SingularAttribute<OkrTaskHandled,String> viewUrl;
    public static volatile SingularAttribute<OkrTaskHandled,String> workId;
    public static volatile SingularAttribute<OkrTaskHandled,String> workTitle;
    public static volatile SingularAttribute<OkrTaskHandled,String> workType;
}
