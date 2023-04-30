import { forwardRef, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";

const Toggleable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisible = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return { toggleVisible };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisible}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className="toggleableContent">
        {props.children}
        <button onClick={toggleVisible}>cancel</button>
      </div>
    </div>
  );
});

Toggleable.propTypes = { buttonLabel: PropTypes.string.isRequired };
Toggleable.displayName = "Toggleable";

export default Toggleable;
