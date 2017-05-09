package com.x.okr.assemble.control.jaxrs.okrworkreportbaseinfo.exception;

import com.x.base.core.exception.PromptException;

public class WorkReportListByWorkIdException extends PromptException {

	private static final long serialVersionUID = 1859164370743532895L;

	public WorkReportListByWorkIdException( Throwable e, String id ) {
		super("根据指定的工作ID查询工作汇报信息时发生异常。WorkId：" + id, e );
	}
}
