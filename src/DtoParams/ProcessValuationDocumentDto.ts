import adm_Attachment from "../Entities/adm_Attachment";
import ProcessValuationDocument from "../Entities/ProcessValuationDocument";
import ReportGeneratorCommand from "../Entities/ReportGeneratorCommand";
import SystemParameter from "../Entities/SystemParameter";
import { BaseParam } from "./BaseParam";

export default class ProcessValuationDocumentDto extends BaseParam {
    
    public ProcessValuationDocument?: ProcessValuationDocument;

    public LstPVDocument?: ProcessValuationDocument[];

    public CommentApprove: string;

    public CommentReject: string;

    public PVDID?: number;

    public LstAttachment?: adm_Attachment[];

    public Attachment?: adm_Attachment;

    ProvinceID?: number;

    DistrictID?: number;

    TownID?: number;

    LstProvince: SystemParameter[];

    LstDistrict: SystemParameter[];
    
    LstTown: SystemParameter[];

    public Filter?: ProcessValuationDocumentFilter;

    public ReportGeneratorCommand?: ReportGeneratorCommand;

}

export class ProcessValuationDocumentFilter {
    public CustomerName?: string;
    public Province?: number;
    public District?: number;
    public Town?: number;
}