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
    <div>
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
    </div>
  );
};

const Button = ({ onClickHandler, uiText }) => {
  return <button onClick={onClickHandler}>{uiText}</button>;
};

const Statistics = ({ feedbackProps }) => {
  let total = 0;
  let score = 0;
  Object.values(feedbackProps).forEach((feedbackProp) => {
    total += feedbackProp.value;
    score += feedbackProp.value * feedbackProp.score;
  });

  const average = () => score / total;
  const percentageOfPositives = () =>
    (feedbackProps.goodProps.value / total) * 100;

  if (!total) return <p>No feedback given</p>;

  return (
    <table>
      <tbody>
        {Object.keys(feedbackProps).map((type) => {
          return (
            <StatisticLine
              key={type}
              text={feedbackProps[type].uiText}
              value={feedbackProps[type].value}
            />
          );
        })}
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average()} />
        <StatisticLine text="positive" value={`${percentageOfPositives()} %`} />
      </tbody>
    </table>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

export default App;
