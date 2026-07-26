import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>ArcPrestige</Text>
        <Text style={styles.subtitle}>Inicia sesión para administrar entrenamientos y asistencias.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo o usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Usuario o correo"
            placeholderTextColor="#7a8a77"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#7a8a77"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4e9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#234626',
    marginBottom: 8,
  },
  subtitle: {
    color: '#5f7460',
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#3d523e',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#f0f5f0',
    paddingHorizontal: 16,
    color: '#1f3624',
    fontSize: 16,
  },
  button: {
    marginTop: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#3f7c51',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
