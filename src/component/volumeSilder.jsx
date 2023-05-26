import React, { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import VolumeUp from "@mui/icons-material/VolumeUp";
import styled from "styled-components";
const NewVolumeup = styled(VolumeUp)`
  color: white;
`;
const NewSilder = styled(Slider)`
  width: 10px;
  height: 10px;
  max-width: 1%;
`;

export default function InputSlider(props) {
  const [value, setValue] = useState(30);
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 140 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <NewVolumeup
            sx={{
              fontSize: 40,
            }}
            onMouseEnter={() => {
              props.newValue();
            }}
          />
        </Grid>
        <Grid item xs>
          <NewSilder
            sx={{
              display: props.value,
              margin: 0,
              padding: 0,
              paddingRight: 10,
            }}
            className="some"
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
