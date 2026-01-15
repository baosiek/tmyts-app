import { Type } from "@angular/core";


/**
 * This interface is the contract between tmyts-toolbar
 * and general-dialog. model, icon and dialog are optional
 * because not all toolbars will have a button.
 */
export interface ITmytsToolBar {
    id: string;
    title: string;
    dialog?: {
        button_text: string;
        button_icon: string;
        dialog_title: string;
        dialog_content: Type<unknown>;
    };
    toolbar_object?: {
        text: string;
        object_content: Type<unknown>;
    } 
}