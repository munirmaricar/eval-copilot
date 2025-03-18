import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const PromptToggle = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  zIndex: 0,
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#00BD83",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 12,
    height: 12,
    borderRadius: 6,
    border: "1px solid #EBE9F1",
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: "#f4f3f7",
    border: "1px solid #EBE9F1",

    boxSizing: "border-box",
  },
}));

export { PromptToggle };
