import { z } from 'zod';
export declare const SignupSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    name: string;
}, {
    username: string;
    password: string;
    name: string;
}>;
export declare const SigninSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const ZapCreateSchema: z.ZodObject<{
    availableTriggerId: z.ZodString;
    triggerMetadata: z.ZodOptional<z.ZodAny>;
    actions: z.ZodArray<z.ZodObject<{
        availableActionId: z.ZodString;
        actionMetadata: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        availableActionId: string;
        actionMetadata?: any;
    }, {
        availableActionId: string;
        actionMetadata?: any;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    availableTriggerId: string;
    actions: {
        availableActionId: string;
        actionMetadata?: any;
    }[];
    triggerMetadata?: any;
}, {
    availableTriggerId: string;
    actions: {
        availableActionId: string;
        actionMetadata?: any;
    }[];
    triggerMetadata?: any;
}>;
