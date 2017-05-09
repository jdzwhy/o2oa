package com.x.bbs.assemble.control.jaxrs.subjectinfo.exception;

import com.x.base.core.exception.PromptException;

public class SubjectFilterException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public SubjectFilterException( Throwable e ) {
		super("根据指定条件查询主题信息时发生异常.", e );
	}
}
