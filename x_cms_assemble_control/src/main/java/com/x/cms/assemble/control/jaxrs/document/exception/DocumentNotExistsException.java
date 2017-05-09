package com.x.cms.assemble.control.jaxrs.document.exception;

import com.x.base.core.exception.PromptException;

public class DocumentNotExistsException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public DocumentNotExistsException( String id ) {
		super("文档信息不存在，无法继续进行操作。Id:" + id );
	}
}
