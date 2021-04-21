import adm_Attachment from "../Entities/adm_Attachment";
import Employee from "../Entities/Employee";
import PreLiminaryQuote from "../Entities/PreLiminaryQuote";
import ProcessValuationDocument from "../Entities/ProcessValuationDocument";
import ReportGeneratorCommand from "../Entities/ReportGeneratorCommand";
import SystemParameter from "../Entities/SystemParameter";
import { BaseParam } from "./BaseParam";

export default class ProcessValuationDocumentDto extends BaseParam {
    
    //public ProcessValuationDocumentID?: number;
    public EmployeeID?: number;

    public ProcessValuationDocument?: ProcessValuationDocument;

    public LstPVDocument?: ProcessValuationDocument[];

    public CommentApprove: string;

    public CommentReject: string;

    public PVDID?: number;

    public LstAttachment?: adm_Attachment[];

    public Attachment?: adm_Attachment;

    public ProvinceID?: number;

    public DistrictID?: number;

    public TownID?: number;

    public LstProvince: SystemParameter[];

    public LstDistrict: SystemParameter[];
    
    public LstTown: SystemParameter[];

    public Filter?: ProcessValuationDocumentFilter;

    public ReportGeneratorCommand?: ReportGeneratorCommand;

    public PreLiminaryQuote?: PreLiminaryQuote;

    public btnPreliminaryOK?: boolean;

    public LstMortgageAsset1: SystemParameter[];

    public LstMortgageAssetLevel: SystemParameter[];

    public LstMortgageAssetRank: SystemParameter[];

    public LstAbilityToTrade: SystemParameter[];

    public LstEmployee?: Employee[];

    public showApprovalAuthority?: boolean;

}

export class ProcessValuationDocumentFilter {
    public CustomerName?: string;
    public Province?: number;
    public District?: number;
    public Town?: number;
}