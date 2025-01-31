import styled, { css } from "styled-components";
import StyledIconWrapper from "@docspace/common/components/Navigation/sub-components/StyledIconWrapper";

const getDefaultStyles = ({ $currentColorScheme }) =>
  $currentColorScheme &&
  css`
    svg {
      path:nth-child(2) {
        fill: ${$currentColorScheme.main.accent};
      }
      circle {
        stroke: ${$currentColorScheme.main.accent};
      }
    }
  `;

export default styled(StyledIconWrapper)(getDefaultStyles);
