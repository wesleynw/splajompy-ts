import IosShareIcon from "@mui/icons-material/IosShare";
import { IconButton } from "@mui/material";

type Props = {
  post_id: number;
};

export default function ShareButton({}: Readonly<Props>) {
  const handleClick = () => {
    navigator.share({ url: window.location.href });
    if (navigator.share && navigator.canShare({ url: window.location.href })) {
      navigator.share({ url: window.location.href });
    } else {
      // TODO: Do something else like copying the data to the clipboard
    }
  };
  return (
    <IconButton onClick={handleClick}>
      <IosShareIcon />
    </IconButton>
  );
}
