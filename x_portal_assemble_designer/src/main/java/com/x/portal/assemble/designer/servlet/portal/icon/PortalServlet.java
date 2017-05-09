package com.x.portal.assemble.designer.servlet.portal.icon;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.imgscalr.Scalr;

import com.x.base.core.application.servlet.AbstractServletAction;
import com.x.base.core.cache.ApplicationCache;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.http.ActionResult;
import com.x.base.core.http.EffectivePerson;
import com.x.base.core.http.WrapOutId;
import com.x.base.core.http.annotation.HttpMethodDescribe;
import com.x.base.core.logger.Logger;
import com.x.base.core.logger.LoggerFactory;
import com.x.portal.assemble.designer.Business;
import com.x.portal.core.entity.Portal;

@WebServlet("/servlet/portal/*")
@MultipartConfig
public class PortalServlet extends AbstractServletAction {

	private static Logger logger = LoggerFactory.getLogger(PortalServlet.class);

	private static final long serialVersionUID = -516827649716075968L;

	@HttpMethodDescribe(value = "更新Portal中的icon图标.", response = WrapOutId.class)
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		ActionResult<WrapOutId> result = new ActionResult<>();
		WrapOutId wrap = null;
		EffectivePerson effectivePerson = this.effectivePerson(request);
		try {
			this.setCharacterEncoding(request, response);
			if (!this.isMultipartContent(request)) {
				throw new Exception("not mulit part request.");
			}
			String portalId = this.getURIPart(request.getRequestURI(), "portal");
			try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
				Business business = new Business(emc);
				Portal portal = emc.find(portalId, Portal.class);
				if (null == portal) {
					throw new PortalNotExistedException(portalId);
				}
				if (!business.portal().checkPermission(effectivePerson, portal)) {
					throw new PortalInsufficientPermissionException(effectivePerson.getName(), portal.getName(),
							portal.getId());
				}
				FileItemIterator fileItemIterator = this.getItemIterator(request);
				while (fileItemIterator.hasNext()) {
					FileItemStream item = fileItemIterator.next();
					try (InputStream input = item.openStream()) {
						if (!item.isFormField()) {
							try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
								BufferedImage image = ImageIO.read(input);
								BufferedImage scalrImage = Scalr.resize(image, 72, 72);
								ImageIO.write(scalrImage, "png", output);
								String icon = Base64.encodeBase64String(output.toByteArray());
								emc.beginTransaction(Portal.class);
								portal.setIcon(icon);
								emc.commit();
								wrap = new WrapOutId(portal.getId());
								result.setData(wrap);
								ApplicationCache.notify(Portal.class);
							}
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error(e, effectivePerson, request, null);
			result.error(e);
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		this.result(response, result);
	}
}