import QuickValuationCondominium from "../Entities/QuickValuationCondominium";
import QuickValuationRE from "../Entities/QuickValuationRE";
import QuickValuationVehicle from "../Entities/QuickValuationVehicle";
import SystemParameter from "../Entities/SystemParameter";

export default class QuickValuationDto {
    //RE
    public QuickValuationRE?: QuickValuationRE;
    public LstTown?: SystemParameter[];
    public TownID?: number;
    //Chung cu
    public QuickValuationCondominium?: QuickValuationCondominium;
    public LstProvince?: SystemParameter[];
    public LstDistrict?: SystemParameter[];
    public LstBuilding?: SystemParameter[];
    public LstStreet?: SystemParameter[];
    public LstSegment?: SystemParameter[];
    public ProvinceID?: number;
    public DistrictID?: number;
    public StreetID?: number;

    //PTVT
    public QuickValuationVehicle?: QuickValuationVehicle;
    public ProducedYear?: number;
    public BrandID?: number;
    public LstCarType?: SystemParameter[];
    public LstBrand?: SystemParameter[];
    public LstModel?: SystemParameter[];
    public ActionCode?: string;
    public OtpCode?: string;
    public VerifyOTP?: boolean;
    public ShowResult?: boolean;
    
}