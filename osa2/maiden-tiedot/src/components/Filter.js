const Filter = ({ onChangeHandler }) => {

  return (
    <div>
      find countries <input onChange={onChangeHandler} />
    </div>
  );
};

export default Filter;
