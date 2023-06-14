import { NextApiRequest, NextApiResponse } from "next";
import {
  BackendErrorLabel,
  BackendResponseStatusCode,
  sendBackendError,
} from "../BackendError/BackendError";
import { CONTENT_TYPE } from "../../types";
import formidable from "formidable";

export const isMultiPartFormData = (
  contentTypeHeader: string
): contentTypeHeader is CONTENT_TYPE.MULTIPART_FORM_DATA => {
  return contentTypeHeader.includes(CONTENT_TYPE.MULTIPART_FORM_DATA);
};

const formidableConfig = {
  maxFileSize: 500 * 1024 * 1024, // 500MB
  allowEmptyFiles: false,
};

interface NextApiRequestExtended extends NextApiRequest {
  formData: {
    fields: formidable.Fields;
    files: formidable.File[];
  };
}

const formidablePromise = (req: NextApiRequest) => {
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      const form = formidable(formidableConfig);
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err);
        }
        return resolve({ fields, files });
      });
    }
  );
};

export const withValidatedFormDataBody =
  (
    handler: (
      req: NextApiRequestExtended,
      res: NextApiResponse
    ) => Promise<void>
  ) =>
  async (req: NextApiRequestExtended, res: NextApiResponse) => {
    const contentTypeHeader = req.headers["content-type"] as CONTENT_TYPE;
    if (contentTypeHeader && !isMultiPartFormData(contentTypeHeader)) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.BAD_REQUEST,
        label: BackendErrorLabel.INVALID_REQUEST_CONTENT_TYPE,
      });
    }

    try {
      const { fields, files } = await formidablePromise(req);
      req.formData = { fields, files: Object.values(files).flat() };
    } catch (error) {
      return sendBackendError(res, {
        code: BackendResponseStatusCode.BAD_REQUEST,
        label: BackendErrorLabel.UNEXPECTED_ERROR,
      });
    }
    return handler(req, res);
  };
