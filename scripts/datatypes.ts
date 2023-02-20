declare module namespace {

    export interface Session {
        ID: string;
        Category: number;
        SubCategory: number;
        Name: string;
        Colour: string;
        StartTime: number;
        EndTime: number;
        Interval: number;
        MaxSinglesSlots: number;
        MaxDoublesSlots: number;
        Capacity: number;
        Recurrence: boolean;
        CostFrom: number;
        CourtCost: number;
        LightingCost: number;
        MemberPrice: number;
        GuestPrice: number;
        Cost?: number;
    }

    export interface Day {
        Date: Date;
        Sessions: Session[];
    }

    export interface Resource {
        ID: string;
        Name: string;
        Number: number;
        Location: number;
        Lighting: number;
        Surface: number;
        Size: number;
        Category: number;
        Days: Day[];
    }

    export interface RootObject {
        TimeZone: string;
        EarliestStartTime: number;
        LatestEndTime: number;
        MinimumInterval: number;
        HideResourceProperties: boolean;
        Resources: Resource[];
    }

}