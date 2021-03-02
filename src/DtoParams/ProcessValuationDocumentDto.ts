import ProcessValuationDocument from "../Entities/ProcessValuationDocument";
import { BaseParam } from "./BaseParam";

export default class ProcessValuationDocumentDto extends BaseParam {
    
    public LstPVDocument?: ProcessValuationDocument[];

    public CommentApprove: string;

    public CommentReject: string;

    public PVDID?: number;

}