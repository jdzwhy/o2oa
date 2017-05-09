package com.x.bbs.assemble.control.jaxrs.sectioninfo.exception;

import com.x.base.core.exception.PromptException;

public class SectionInsufficientPermissionException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public SectionInsufficientPermissionException( String name, String forum ) {
		super("用户["+ name +"]没有论坛分区["+ forum +"]管理员，无法管理版块信息！" );
	}
}
