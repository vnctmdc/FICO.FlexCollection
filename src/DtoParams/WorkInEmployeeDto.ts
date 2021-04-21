import vWorkingCalendarDetail from "../Entities/EntityViews/vWorkingCalendarDetail";
import sb_ConfArea from "../Entities/sb_ConfArea";
import sb_ConfRegion from "../Entities/sb_ConfRegion";
import sb_ConfRegionEmployee from "../Entities/sb_ConfRegionEmployee";
import { BaseParam } from "./BaseParam";

export default class WorkInEmployeeDto extends BaseParam {

    public ConfAreaID?: number;

    public ConfRegionID?: number;
    
    public ListConfRegion?: sb_ConfRegion[];

    public ListConfArea?: sb_ConfArea[];

    public ListConfRegionEmployee?: sb_ConfRegionEmployee[];

    public vWorkingCalendarDetail?: vWorkingCalendarDetail;

    public ListvWorkingCalendarDetail?: vWorkingCalendarDetail[];

}