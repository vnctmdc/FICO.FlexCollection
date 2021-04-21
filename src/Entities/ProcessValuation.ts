import MortgageAssetProductionLineDetail from "./MortgageAssetProductionLineDetail";

export default class ProcessValuation{
    public ProcessValuationID?: number;
    
    public PVDConsolidateID?: number;

    public ProcessValuationDocumentID?: number;

    public MortgageAssetID?: number;

    public MortgageAssetCode?: string;

    public MortgageAssetCode1?: number;

    public MortgageAssetCode2?: number;

    public RelationshipOwnerCustomer?: number;

    public RelationshipOwnerCustomerDetail?: string;

    public UsePurpose?: number;

    public RoundTotalValuationAmountInWord?: string;

    public TotalValuationAmount?: number;

    public RoundTotalValuationAmount?: number;

    public EquipmentName?: string;

    public MortgageAssetLevel2?: number;

    public Advantage?: string;

    public DisAdvantage?: string;

    public WorkfieldOtherInfomation?: string;

    public Version?: number;

    public CoordinateLat?: string;

    public CoordinateLon?: string;

    public Coordinate?: string;

    public InfactAddress?: string;

    public UsePurposeDetail?: string;

    public ListMortgageAssetProductionLineDetail?: MortgageAssetProductionLineDetail[];

    public ContiguousStreetType?: number;

    public OnLandDescription?: string;

    public PositionDescription?: string;
    
}