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
      score: 1,
    },
    neutralProps: {
      value: neutral,
      setter: setNeutral,
      uiText: "neutral",
      score: 0,
    },
    badProps: {
      value: bad,
      setter: setBad,
      uiText: "bad",
      score: -1,
    },
  };

  const getIncreaseByOne = (value, setter) => () => setter(value + 1);

  return (
    <div>
      <h2>give feedback</h2>
      <ButtonSet
        buttonProps={feedbackProps}
        onClickHandler={getIncreaseByOne}
      />
      <h2>statistics</h2>
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
  let total = 0;
  let score = 0;
  const average = () => total && score / total;
  const percentageOfPositives = () =>
    total && (feedbackProps.goodProps.value / total) * 100;

  return (
    <>
      {Object.keys(feedbackProps).map((type) => {
        total += feedbackProps[type].value;
        score += feedbackProps[type].value * feedbackProps[type].score;
        return (
          <div key={type}>
            {feedbackProps[type].uiText} {feedbackProps[type].value}
            <br />
          </div>
        );
      })}
      all {total}
      <br />
      average {average()}
      <br />
      positive {percentageOfPositives()} % <br />
    </>
  );
};

export default App;
