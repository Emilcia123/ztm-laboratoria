import React, { useState } from 'react';
import { IonGrid, IonRow, IonCol, IonButton, IonCard, IonCardContent } from '@ionic/react';


const Kalkulator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || resetDisplay) {
      setDisplay(num);
      setResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimal = () => {
    if (resetDisplay) {
      setDisplay('0.');

      setResetDisplay(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {

    setPrevValue(parseFloat(display));
    setOperation(op);
    setResetDisplay(true);
  };

  const calculate = () => {

    if (operation === null || prevValue === null) return;

    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = prevValue + current;
        break;
      case '-':
        result = prevValue - current;
        break;
      case '×':
        result = prevValue * current;
        break;
      case '÷':
        if (current === 0) {
          setDisplay('Nie można dzielić przez zero');
          setPrevValue(null);
          setOperation(null);
          setResetDisplay(true);
          return;
        }
        result = prevValue / current;
        break;
      default:
        return;
    }
    

    const roundedResult = parseFloat(result.toFixed(10));
    setDisplay(roundedResult.toString());
    setPrevValue(null);
    setOperation(null);
    setResetDisplay(true);
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setResetDisplay(false);
  };

  return (
    <IonCard style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'right', fontSize: '14px', marginBottom: '15px', padding: '50px', background: '#f4f5f8', borderRadius: '40px' }}>
      <IonCardContent>
        <div className="calc-display" style={{ textAlign: 'right', fontSize: '24px', marginBottom: '15px', padding: '10px', background: '#f4f5f8', borderRadius: '4px' }}>
          {display}
        </div>
        <IonGrid>
          <IonRow>
            <IonCol><IonButton expand="block" onClick={() => handleNumber('7')}>7</IonButton></IonCol>
            <IonCol><IonButton expand="block" onClick={() => handleNumber('8')}>8</IonButton></IonCol>
            <IonCol><IonButton expand="block" onClick={() => handleNumber('9')}>9</IonButton></IonCol>
            <IonCol><IonButton expand="block" color="warning" onClick={() => handleOperation('÷')}>÷</IonButton></IonCol>
          </IonRow>



          <IonRow>
            <IonCol><IonButton expand="block" onClick={() => handleNumber('4')}>4</IonButton></IonCol>
            <IonCol><IonButton expand="block" onClick={() => handleNumber('5')}>5</IonButton></IonCol>
            <IonCol><IonButton expand="block" onClick={() => handleNumber('6')}>6</IonButton></IonCol>
            <IonCol><IonButton expand="block" color="warning" onClick={() => handleOperation('×')}>×</IonButton></IonCol>
          </IonRow>


          
          <IonRow>
            <IonCol><IonButton expand="block" onClick={() => handleNumber('1')}>1</IonButton></IonCol>
            <IonCol><IonButton expand="block" onClick={() => handleNumber('2')}>2</IonButton></IonCol>
            <IonCol><IonButton expand="block" onClick={() => handleNumber('3')}>3</IonButton></IonCol>
            <IonCol><IonButton expand="block" color="warning" onClick={() => handleOperation('-')}>-</IonButton></IonCol>
          </IonRow>


          <IonRow>
            <IonCol><IonButton expand="block" color="danger" onClick={clear}>C</IonButton></IonCol>
            <IonCol><IonButton expand="block" onClick={() => handleNumber('0')}>0</IonButton></IonCol>
            <IonCol><IonButton expand="block" onClick={handleDecimal}>.</IonButton></IonCol>
            <IonCol><IonButton expand="block" color="warning" onClick={() => handleOperation('+')}>+</IonButton></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton expand="block" color="success" onClick={calculate}>=</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default Kalkulator;