import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const feedbackProps = {
    goodProps: {
      value: good,
      setter: setGood,
      uiText: "good",
    },
    neutralProps: {
      value: neutral,
      setter: setNeutral,
      uiText: "neutral",
    },
    badProps: {
      value: bad,
      setter: setBad,
      uiText: "bad",
    },
  };

  const getIncreaseByOne = (value, setter) => () => setter(value + 1);

  return (
    <div>
      <ButtonSet
        buttonProps={feedbackProps}
        onClickHandler={getIncreaseByOne}
      />
      <Statistics feedbackProps={feedbackProps} />
    </div>
  );
};

const ButtonSet = ({ buttonProps, onClickHandler }) => {
  return (
    <>
      {Object.keys(buttonProps).map((type) => {
        return (
          <Button
            onClickHandler={onClickHandler(
              buttonProps[type].value,
              buttonProps[type].setter
            )}
            uiText={buttonProps[type].uiText}
            key={type}
          />
        );
      })}
    </>
  );
};

const Button = ({ onClickHandler, uiText }) => {
  return <button onClick={onClickHandler}>{uiText}</button>;
};

const Statistics = ({ feedbackProps }) => {
  return (
    <p>
      {Object.keys(feedbackProps).map((type) => {
        return (
          <div key={type}>
            {feedbackProps[type].uiText} {feedbackProps[type].value}
            <br />
          </div>
        );
      })}
    </p>
  );
};

export default App;
