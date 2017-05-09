package com.x.organization.assemble.control.alpha.jaxrs.person;

import java.util.List;

import com.x.base.core.http.ActionResult;
import com.x.organization.assemble.control.alpha.wrapout.WrapOutPerson;

class ActionListNext extends ActionBase {

	protected ActionResult<List<WrapOutPerson>> execute(String id, Integer count) throws Exception {
		return this.standardListNext(ActionBase.outCopier, id, count, "sequence", null, null, null, null, null, null,
				null, true, DESC);
	}

}
