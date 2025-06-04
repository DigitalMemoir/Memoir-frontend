const GoogleSearchBar = () => {
  return (
    <label
      className={
        'input w-full max-w-[900px] h-36 py-6 px-14 \
        flex items-center justify-between bg-white rounded-[50px] \
        shadow-[0px_0px_8px_0px_rgba(0,0,0,0.20)]'
      }
    >
      <img src={'/googleIcon.svg'} className={'w-16 h-16'} />
      <input type={'search'} className={'grow w-full h-full'} />
      <button>Search</button>
    </label>
  );
};

export default GoogleSearchBar;
