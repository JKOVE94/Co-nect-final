import "./toogleSwitch.css";
const ToogleSwitch = (props) => {
  const handleSwitch = () => {
    props.setToggle(!props.toggle);
  };
  return (
    <>
      <label className="switch">
        <input
          type="checkbox"
          className="switch-input"
          value={props.toggle}
          onChange={handleSwitch}
        />
        {/* <i class="icon-play"></i> */}
        <span
          className="switch-label"
          data-on="간트차트"
          data-off="테이블"
        ></span>
        <span className="switch-handle"></span>
      </label>
    </>
  );
};
export default ToogleSwitch;
