import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

export default function ControlledCheckbox({checked, handleChecked, id}) {
    // const [checked, setChecked] = React.useState(false);

    return (
        <Checkbox
            checked={checked}
            onChange={(event) => handleChecked(event, id)}
            inputProps={{'aria-label': 'controlled'}}
        />
    );
}