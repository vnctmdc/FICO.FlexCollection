import * as Enums from "./Enums";
export default class SMX {
    static StoreName = class {
        static GlobalStore = "GlobalStore";
    };

    static PromisePaid = class {
        static dicName: iKeyValuePair<Enums.PromisePaid, string>[] = [
            { Key: Enums.PromisePaid.ThatHua, Value: "BPTP - Không đúng cam kết" },
            { Key: Enums.PromisePaid.TraDu, Value: "KPTP - Đúng cam kết" },
        ];

        static dicColor: iKeyValuePair<Enums.PromisePaid, string>[] = [
            { Key: Enums.PromisePaid.ThatHua, Value: "#EE6400" },
            { Key: Enums.PromisePaid.TraDu, Value: "#597EF7" },
        ];
    };

    static NotificationType = class {
        static dicName: iKeyValuePair<Enums.NotificationType, string>[] = [
            { Key: Enums.NotificationType.SinhNhat, Value: "Sinh nhật" },
            { Key: Enums.NotificationType.KyNiem, Value: "Kỷ niệm" },
            { Key: Enums.NotificationType.ThanhLap, Value: "Thành lập" },
            { Key: Enums.NotificationType.TruyenThong, Value: "Truyền thống" },
        ];
    };

    static Attitudes = class {
        static dicName: iKeyValuePair<Enums.Attitude, string>[] = [
            { Key: Enums.Attitude.TichCuc, Value: "Tích cực" },
            { Key: Enums.Attitude.TieuCuc, Value: "Tiêu cực" },
            { Key: Enums.Attitude.TrungLap, Value: "Trung lập" },
        ];

        static dicColor: iKeyValuePair<Enums.Attitude, string>[] = [
            { Key: Enums.Attitude.TichCuc, Value: "#597EF7" },
            { Key: Enums.Attitude.TieuCuc, Value: "#EE6400" },
            { Key: Enums.Attitude.TrungLap, Value: "#389E0D" },
        ];
    };

    static RelationshipWithMB = class {
        static dicName: iKeyValuePair<Enums.RelationshipWithMB, string>[] = [
            { Key: Enums.RelationshipWithMB.NongAm, Value: "Nồng ấm" },
            { Key: Enums.RelationshipWithMB.ThietLap, Value: "Thiết lập" },
            { Key: Enums.RelationshipWithMB.HieuBiet, Value: "Hiểu biết" },
            { Key: Enums.RelationshipWithMB.ThanThiet, Value: "Thân thiết" },
        ];

        static dicColor: iKeyValuePair<Enums.RelationshipWithMB, string>[] = [
            { Key: Enums.RelationshipWithMB.NongAm, Value: "#597EF7" },
            { Key: Enums.RelationshipWithMB.ThietLap, Value: "#EE6400" },
            { Key: Enums.RelationshipWithMB.HieuBiet, Value: "#389E0D" },
            { Key: Enums.RelationshipWithMB.ThanThiet, Value: "#D9001B" },
        ];
    };

    static PositiveType = class {
        static readonly dicName: iKeyValuePair<Enums.PositiveType, string>[] = [
            { Key: Enums.PositiveType.TruyenHinh, Value: "Truyền hình" },
            { Key: Enums.PositiveType.BaoMang, Value: "Báo mạng" },
            { Key: Enums.PositiveType.BaoGiay, Value: "Báo giấy" },
            { Key: Enums.PositiveType.MangXaHoi, Value: "Mạng xã hội" },
            { Key: Enums.PositiveType.DienDan, Value: "Diễn đàn" },
        ];
    };

    static NegativeNews = class {
        static readonly dicName: iKeyValuePair<Enums.NegativeNews, string>[] = [
            { Key: Enums.NegativeNews.ChuaPhatSinh, Value: "Chưa lên báo" },
            { Key: Enums.NegativeNews.DaPhatSinh, Value: "Đã lên báo" },
        ];
        static readonly dicColor: iKeyValuePair<Enums.NegativeNews, string>[] = [
            { Key: Enums.NegativeNews.ChuaPhatSinh, Value: "#597EF7" },
            { Key: Enums.NegativeNews.DaPhatSinh, Value: "#D9001B" },
        ];
    };

    static NewStatus = class {
        static dicName: iKeyValuePair<Enums.NewStatus, string>[] = [
            { Key: Enums.NewStatus.MoiTao, Value: "Đang xử lý" },
            { Key: Enums.NewStatus.HoanThanh, Value: "Hoàn thành" },
        ];
        static readonly dicColor: iKeyValuePair<Enums.NewStatus, string>[] = [
            { Key: Enums.NewStatus.MoiTao, Value: "#EE6400" },
            { Key: Enums.NewStatus.HoanThanh, Value: "#389E0D" },
        ];
    };

    static Classification = class {
        static readonly dicName: iKeyValuePair<Enums.Classification, string>[] = [
            { Key: Enums.Classification.BinhThuong, Value: "Bình thường" },
            { Key: Enums.Classification.QuanTrong, Value: "Quan trọng" },
            { Key: Enums.Classification.TrungBinh, Value: "Trung bình" },
        ];
        static readonly dicColor: iKeyValuePair<Enums.Classification, string>[] = [
            { Key: Enums.Classification.BinhThuong, Value: "#2F54EB" },
            { Key: Enums.Classification.QuanTrong, Value: "red" },
            { Key: Enums.Classification.TrungBinh, Value: "green" },
        ];
    };

    // Trạng thái Yes/No
    static YesNo = class {
        static Yes = true;
        static No = false;

        static dicName: iKeyValuePair<boolean, string>[] = [
            { Key: true, Value: "Có" },
            { Key: false, Value: "Không" },
        ];
    };

    // Giới tính
    static Gender = class {
        static readonly dicName: iKeyValuePair<Enums.Gender, string>[] = [
            { Key: Enums.Gender.Male, Value: "Nam" },
            { Key: Enums.Gender.Female, Value: "Nữ" },
            { Key: Enums.Gender.Other, Value: "Khác" },
        ];
    };

    static NewsStatus = class {
        static readonly dicName: iKeyValuePair<Enums.NewsStatus, string>[] = [
            { Key: Enums.NewsStatus.HoanThanh, Value: "Hoàn hành" },
            { Key: Enums.NewsStatus.MoiTao, Value: "Mới tạo" },
        ];

        static readonly dicColorBackground: iKeyValuePair<Enums.NewsStatus, string>[] = [
            { Key: Enums.NewsStatus.HoanThanh, Value: "#F0F5FF" },
            { Key: Enums.NewsStatus.MoiTao, Value: "#FFF7E6" },
        ];

        static readonly dicColor: iKeyValuePair<Enums.NewsStatus, string>[] = [
            { Key: Enums.NewsStatus.HoanThanh, Value: "#2F54EB" },
            { Key: Enums.NewsStatus.MoiTao, Value: "#FA8C16" },
        ];

        static readonly dicIcons: iKeyValuePair<Enums.NewsStatus, string>[] = [
            { Key: Enums.NewsStatus.HoanThanh, Value: "download" },
            { Key: Enums.NewsStatus.MoiTao, Value: "arrow-right" },
        ];
    };

    static KyHuaTra = class {
        static readonly dicName: iKeyValuePair<Enums.KyHuaTra, string>[] = [
            { Key: Enums.KyHuaTra.k1, Value: "Hứa trả 1 kỳ" },
            { Key: Enums.KyHuaTra.k2, Value: "Hứa trả 2 kỳ" },
            { Key: Enums.KyHuaTra.k3, Value: "Hứa trả 3 kỳ" },
            { Key: Enums.KyHuaTra.k4, Value: "Tất cả" },
        ];
    };

    static AttachmentRefType = class {
        static readonly dicName: iKeyValuePair<Enums.AttachmentRefType, string>[] = [
            { Key: Enums.AttachmentRefType.ActionField, Value: "Tác nghiệp" },
            { Key: Enums.AttachmentRefType.CustomerInfo, Value: "Hồ sơ khách hàng" },
        ];
    };

    static ValidateDocumentReason = class {
        static readonly dicValidateDocumentReason: iKeyValuePair<Enums.ValidateDocumentReason, string>[] = [
            { Key: Enums.ValidateDocumentReason.BoSungHoSo, Value: "Bổ sung hồ sơ" },
            { Key: Enums.ValidateDocumentReason.XacMinhQuyHoach, Value: "Xác minh quy hoạch" },
            { Key: Enums.ValidateDocumentReason.XacMinhViTri, Value: "Xác minh vị trí" },
            { Key: Enums.ValidateDocumentReason.XacMinhTranhChap, Value: "Xác minh tranh chấp" },
            { Key: Enums.ValidateDocumentReason.KhachHangKhongVayNua, Value: "Khách hàng không vay nữa" },
            { Key: Enums.ValidateDocumentReason.LyDoKhac, Value: "Lý do khác" },
        ];
    }

    static MapDocumentRequireStatus = class {
        static readonly dtcMapDocumentTypeStatus: iKeyValuePair<Enums.MapDocumentRequireStatus, string>[] = [
            { Key: Enums.MapDocumentRequireStatus.Suggest, Value: "Nên có" },
            { Key: Enums.MapDocumentRequireStatus.Obligatory, Value: "Bắt buộc" },
            { Key: Enums.MapDocumentRequireStatus.Addition, Value: "Bổ sung thêm" },
        ];
    };

    static ProcessValuationDocumentContactType = class {
        static readonly dicName: iKeyValuePair<Enums.ProcessValuationDocumentContactType, string>[] = [
            { Key: Enums.ProcessValuationDocumentContactType.ChualienLacDuoc, Value: "Chưa liên lạc được" },
            { Key: Enums.ProcessValuationDocumentContactType.LienLacDuoc, Value: "Liên lạc được" },
        ];
    };

    static ApiActionCode = class {
        static SetupViewForm = "SetupViewForm";
        static SearchData = "SearchData";
        static SetupEditForm = "SetupEditForm";
        static SaveItem = "SaveItem";
        static SetupDisplay = "SetupDisplay";
        static DeleteItem = "DeleteItem";
        static Request = "Request";
        static Approve = "Approve";
        static Reject = "Reject";
        static SaveImage = "SaveImage";
        static ApproveBatch = "ApproveBatch";
        static ApproveBatchNext = "ApproveBatchNext";
        static RejectBatch = "RejectBatch";
        static RequestApproval = "RequestApproval";
        static HistoryApproval = "HistoryApproval";
        static DetailDisplay = "DetailDisplay";
        static UpdateAttachment = "UpdateAttachment";

        //Lấy thông tin người đăng nhập
        static GetProfile = "GetProfile";

        //new
        static DanhsachTSKhaoSat = "DanhsachTSKhaoSat";
        static GetListValuationApproving = "GetListValuationApproving";
        static GetListValuation = "GetListValuation";
        // quickValuation
        static SetupViewREForm = "SetupViewREForm";
        static SetupViewCondominiumForm = "SetupViewCondominiumForm";
        static SetupViewVehicleForm = "SetupViewVehicleForm";
        static ValuationCondominiums = "ValuationCondominiums";
        static ValuationREs = "ValuationREs";
        static ValuationVehicles = "ValuationVehicles";
        static LoadData = "LoadData";
        static Actions = "Actions";
        static SaveActions = "SaveActions";
        static CheckInActions = "CheckInActions";
        static GetAttachmentByECMID = "GetAttachmentByECMID";
        static GetPVDApproving = "GetPVDApproving";
        static DocumentRequest = "DocumentRequest";
        static SaveData = "SaveData";

    };

    static Features = class {
        static AddressProvince = 1204;
        static AddressDistrict = 1205;
        static AddressTown = 1206;
        static AddressStreet = 1207;
        static ComparingMASourceType = 1336;
        static DocumentType = 1313;
        static LandType = 1339;
        static smx_CollateralGroup_1 = 2004;
    };

    static RandomColor = [
        "#02c39a",
        "#fb5607",
        "#028090",
        "#3a86ff",
        "#8338ec",
        "#ff006e",
        "#e63946",
        "#8ac926",
        "#fee440",
        "#f15bb5",
        "#9a031e",
        "#5f0f40",
        "#7678ed",
        "#245501",
        "#926c15",
    ];

    static ActionCode = class {
        static Calculate_Price = "Calculate_Price";
        static Verify_OTP = "Verify_OTP";
    }

    static DocumentCode = class {
        static DocumentWorkfield = "BienBan_KSHT";
        static ValuationReport = "BCDG";
        static ValuationReport_Scan = "BCDG_BanScan";
        static TaiLieuKhac = "TaiLieu_Khac";
        static ChungThuBenThu3 = "BenThu3_ChungThu";
        static KhoGia = "KhoGia";
        static TuVanGia = "TuVanGia";
        static SiteCheckSuggester = "SiteCheckSuggester";
        static BienBanTienKiem = "BienBanTienKiem";
        static BienBanThamDinh = "BienBanThamDinh";
        static SiteCheckValuationReport = "BCTĐ";
    }

    static MortgageAssetCode2 = class {
        // BDS
        static BatchEquipments = "BatchEquipments";
        static BatchVehicles = "BatchVehicles";
        static Equipments = "Equipments";
        static REApartments = "REApartments";
        static REBuildings = "REBuildings";
        static RECondominiums = "RECondominiums";
        static REFactories = "REFactories";
        static REProjects = "REProjects";
        static REResidentials = "REResidentials";
        static VehicleRoads = "VehicleRoads";
        static Vessels = "Vessels";
        static Workfields = "Workfields";
    }
    static ProcessValuationREFrontageType = class {
        static readonly dicProcessValuationREFrontageType: iKeyValuePair<Enums.ProcessValuationREFrontageType, string>[] = [
            { Key: Enums.ProcessValuationREFrontageType.MatDuongPho, Value: "Mặt đường/Phố" },
            { Key: Enums.ProcessValuationREFrontageType.MatNgoHem, Value: "Mặt ngõ/hẻm" },
            { Key: Enums.ProcessValuationREFrontageType.MatDuongNoiBo, Value: "Mặt đường nội bộ" },
        ];
    };

}
