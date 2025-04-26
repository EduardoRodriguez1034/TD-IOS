import React, { useRef, useState } from 'react';
import { View, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { COLORS } from '../constants/theme';

interface OTPInputProps {
  code: string[];
  setCode: (code: string[]) => void;
}

const OTPInput = ({ code, setCode }: OTPInputProps) => {
  const inputRefs = useRef<RNTextInput[]>([]);
  const [focused, setFocused] = useState<number>(-1);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <RNTextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          style={[
            styles.input,
            focused === index && styles.focused,
            { borderColor: focused === index ? COLORS.primary : COLORS.gray }
          ]}
          maxLength={1}
          keyboardType="number-pad"
          value={code[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocused(index)}
          onBlur={() => setFocused(-1)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: COLORS.white,
  },
  focused: {
    borderWidth: 2,
  },
});

export default OTPInput; 
