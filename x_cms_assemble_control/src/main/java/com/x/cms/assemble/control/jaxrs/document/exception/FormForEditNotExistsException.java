package com.x.cms.assemble.control.jaxrs.document.exception;

import com.x.base.core.exception.PromptException;

public class FormForEditNotExistsException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public FormForEditNotExistsException( String id ) {
		super("分类设置的文档编辑表单不存在。ID:" + id );
	}
}
