export default class ProcessValuationDocument{
    public ProcessValuationDocumentID?: number;
    public ValuationDocumentID?: number;
    public ParentID?: number;
    public ValuationDocumentDetailID?: number;
    public MortgageAssetID?: number;
    public Code?: string;
    public MortgageAssetCode?: string;
    public MortgageAssetCode1?: number;
    public MortgageAssetCode2?: number;
    public CustomerID?: number;
    public CustomerName?: string;
    public ValuationOrganizationID?: number;
    public ValuationOrganizationDTG?: Date;
    public ValuationEmployeeID?: number;
    public ValuationEmployeeDTG?: Date;
    public ValuationEmployeeBy?: number;
    public SubEmployeeID?: number;
    public ValidateDocumentStatus?: number;
    public ValidateDocumentComment?: string;
    public RequestFixReportComment?: string;
    public ValidateDocumentDeadlineDTG?: Date;
    public ValidateDocumentReason?: number;
    public WorkfieldType?: boolean;
    public WorkfieldContactDTG?: Date;
    public WorkfieldContactResult?: number;
    public WorkfieldPlanDTG?: Date;
    public WorkfieldActualStartDTG?: Date;
    public WorkfieldActualEndDTG?: Date;
    public WorkfieldDistance?: number;
    public Status?: number;
    public OldStatus?: number;
    public MortgageAssetAddress?: string;
    public WorkfieldName?: string;
    public WorkfieldPhone?: string;
    //BCĐG
    public TotalValuationAmount?: number;
    public ValuationEmployeeName?: string;
    public ValuationOrganizationName?: string;
    public MortgageAssetCode1Name?: string;
    //
    public SLAPlanEnd?: string;
}