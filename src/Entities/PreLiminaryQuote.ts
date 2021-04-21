export default class PreLiminaryQuote {
    public PreLiminaryQuoteID?: number;
    public ProcessValuationDocumentID?: number;
    public ValuationDocumentID?: number;
    public ValuationDocumentDetailID?: number;
    public MortgageAssetOwnerName?: string;
    public EmployeeName?: string;
    public Code?: string;
    public MACode1?: number;
    public MortgageAssetDescription?: string;
    public TotalValuationAmount?: number;
    public MortgageAssetLevel3?: number;
    public MortgageAssetRank?: number;
    public AbilityToTrade?: number;
    public CoefficientAbilityToTrade?: number;
    public CoefficientCredit?: number;
    public WorkfieldOtherInfomation?: string;
    public ApprovingBy?: number;
    public ApprovingEmployee?: string;
    public Version?: number;
    public Recommendation?: string;
    public CreatedDTG?: Date;
    public CreatedDTGText?: string;
    public CreatedBy?: string;

    //extends
    public MACode1Name?: string;
    public MortgageAssetLevel3Name?: string;
    public MortgageAssetRankName?: string;
    public AbilityToTradeName?: string;

}