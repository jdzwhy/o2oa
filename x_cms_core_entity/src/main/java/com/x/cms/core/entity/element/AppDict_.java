/** 
 *  Generated by OpenJPA MetaModel Generator Tool.
**/

package com.x.cms.core.entity.element;

import com.x.base.core.entity.SliceJpaObject_;
import java.lang.String;
import java.util.Date;
import javax.persistence.metamodel.SingularAttribute;

@javax.persistence.metamodel.StaticMetamodel
(value=com.x.cms.core.entity.element.AppDict.class)
@javax.annotation.Generated
(value="org.apache.openjpa.persistence.meta.AnnotationProcessor6",date="Sat May 06 19:34:34 CST 2017")
public class AppDict_ extends SliceJpaObject_  {
    public static volatile SingularAttribute<AppDict,String> alias;
    public static volatile SingularAttribute<AppDict,String> appId;
    public static volatile SingularAttribute<AppDict,Date> createTime;
    public static volatile SingularAttribute<AppDict,String> creatorUid;
    public static volatile SingularAttribute<AppDict,String> description;
    public static volatile SingularAttribute<AppDict,String> id;
    public static volatile SingularAttribute<AppDict,String> name;
    public static volatile SingularAttribute<AppDict,String> sequence;
    public static volatile SingularAttribute<AppDict,Date> updateTime;
}
