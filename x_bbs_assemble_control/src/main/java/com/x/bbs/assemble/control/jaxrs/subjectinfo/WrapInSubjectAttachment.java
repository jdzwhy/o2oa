package com.x.bbs.assemble.control.jaxrs.subjectinfo;

import java.util.ArrayList;
import java.util.List;

import com.x.base.core.http.annotation.Wrap;
import com.x.bbs.entity.BBSSubjectAttachment;

@Wrap( WrapInSubjectAttachment.class)
public class WrapInSubjectAttachment extends BBSSubjectAttachment{

	private static final long serialVersionUID = -5076990764713538973L;
	public static List<String> Excludes = new ArrayList<String>();
}
