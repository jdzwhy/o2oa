package com.x.okr.assemble.control.jaxrs.okrworkauthorizerecord.exception;

import com.x.base.core.exception.PromptException;

public class AuthorizeRecordIdEmptyException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public AuthorizeRecordIdEmptyException() {
		super("id为空，无法进行查询。" );
	}
}
