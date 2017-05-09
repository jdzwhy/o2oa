package com.x.bbs.assemble.control.jaxrs.roleinfo.exception;

import com.x.base.core.exception.PromptException;

public class ForumIdEmptyException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public ForumIdEmptyException() {
		super("论坛分区id为空， 无法进行查询." );
	}
}
