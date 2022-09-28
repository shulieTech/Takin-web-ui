import React, { useState, useEffect, createContext, useContext } from 'react';
import Introduce from './components/Introduce';
import SelectTypeModal from './modals/SelectTypeModal';
import Detail from './components/Detail';

import { PrepareContext } from './_layout';

export default (props) => {
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  return (
    <>
      {!prepareState.currentLink?.id ? <Introduce /> : <Detail />}
      <SelectTypeModal
        detail={prepareState.currentLink}
        cancelCallback={() => setPrepareState({ currentLink: null })}
      />
    </>
  );
};
