import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text'
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker'
import api from '../../services/api';

interface OrphanageDataRouteParams {
  position: {
    latitude: number
    longitude: number
  }
}

export default function OrphanageData() {
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [contact_number, setContactNumber] = useState('')
  const [instructions, setInstruction] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<string[]>([])

  const navigation = useNavigation()
  const route = useRoute()
  const params = route.params as OrphanageDataRouteParams

  async function handleCreateOrphanage() {
    const { latitude, longitude } = params.position

    const data = new FormData()

    data.append('name', name)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('about', about)
    data.append('contact_number', contact_number)
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekends', String(open_on_weekends))
    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image
      } as any)
    })

    await api.post('orphanages', data)

    navigation.navigate('OrphanagesMap')
  }

  async function handleSelectImages() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync()

    if (status !== 'granted') {
      alert('Eita, precisamos de acesso as sua fotos...')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    })

    if (result.cancelled) {
      return
    }

    const { uri: image } = result

    setImages([...images, image])
  }

  function handleDeletImage(index: number) {
    images.splice(index, 1)
    setImages([...images])
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        value={about}
        onChangeText={setAbout}
        multiline
      />

      <Text style={styles.label}>Número de Whatsapp</Text>
      <TextInputMask
        style={styles.input}
        keyboardType="numeric"
        type={'custom'}
        options={{
          mask: '+55 (99) 99999-9999',
        }}
        value={contact_number}
        onChangeText={(text) => {
          setContactNumber(text.replace(/\D+/g, ''))
        }}
      />

      <Text style={styles.label}>Fotos</Text>

      <View style={styles.imageContainer}>
        {images.map((image, index) => {
          return (
            <LinearGradient
              key={image}
              colors={['#FFC2D8', '#A1E9C5']}
              start={{ x: 1, y: 0.5 }}
              end={{ x: 0.4, y: 0.5 }}
              style={styles.uploadedImageContainerStroke}
            >
              <LinearGradient
                colors={['#FCF0F4', '#EDFFF6']}
                start={{ x: 1, y: 0.5 }}
                end={{ x: 0.4, y: 0.5 }}
                style={styles.uploadedImageContainer}
              >
                <Image

                  source={{ uri: image }}
                  style={styles.uploadedImage}
                />
                <Text style={styles.imageName}>
                  {image.split('/')[9].split('-')[4]}
                </Text>
                <TouchableOpacity style={styles.imagesDelete} onPress={() => handleDeletImage(index)}>
                  <Feather name="x" size={24} color="#FF669D" />
                </TouchableOpacity>
              </LinearGradient>
            </LinearGradient>

          )
        })}
      </View>

      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        value={instructions}
        onChangeText={setInstruction}
        multiline
      />

      <Text style={styles.label}>Horario de visitas</Text>
      <TextInput
        style={styles.input}
        value={opening_hours}
        onChangeText={setOpeningHours}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende final de semana?</Text>
        <Switch
          thumbColor="#fff"
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={open_on_weekends}
          onValueChange={setOpenOnWeekends}
        />
      </View>

      <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6'
  },

  label: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
  },

  imageContainer: {
    flexDirection: 'column',
    borderRadius: 10,
  },

  uploadedImageContainerStroke: {
    height: 72,
    paddingTop: 16,
    paddingHorizontal: 1,
    borderRadius: 20,
    marginBottom: 16,
    justifyContent: 'center'
  },

  uploadedImageContainer: {
    position: 'relative',
    flexDirection: 'row',
    marginBottom: 16,
    height: 70,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 19
  },

  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },

  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  imagesDelete: {
    padding: 24,
    position: "absolute",
    right: 0,
  },

  imageName: {
    marginLeft: 20,
    color: '#37C77F'
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})