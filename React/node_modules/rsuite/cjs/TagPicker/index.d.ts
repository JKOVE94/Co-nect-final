import React from 'react';
import { InputPickerProps } from '../InputPicker/InputPicker';
import { TagOnlyProps } from '../InputPicker/InputPickerContext';
import type { PickerComponent } from '../internals/Picker/types';
import type { CheckboxProps } from '../Checkbox';
export interface TagPickerProps extends InputPickerProps, Partial<TagOnlyProps> {
    /**
     * Custom render checkbox on menu item
     * @version 5.47.0
     **/
    renderMenuItemCheckbox?: (checkboxProps: CheckboxProps) => React.ReactNode;
}
/**
 * `TagPicker` component enables multi-selection by tags and supports new options.
 *
 * @see https://rsuitejs.com/components/tag-picker/
 */
declare const TagPicker: PickerComponent<TagPickerProps>;
export default TagPicker;
