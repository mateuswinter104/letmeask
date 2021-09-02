import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"


type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string;
  isAnswered: boolean,
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

type QuestionType = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string;
  isAnswered: boolean,
  isHighlighted: boolean,
  likeCount: number,
  likeId: string | undefined,
}

export function useRoom(roomId: string) {
  const { user } = useAuth()
  const [questions ,setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState()

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map( ([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) =>  like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })

    return () => {
      roomRef.off('value')
    }
  },[roomId, user?.id])

  return { questions, title }
}
//[roomId] = toda vez que o código da sala mudar por algum motivo, executamos novamente o useEffect
//se o '[]' estiver vazio, a função dentro do '{}' será executada apenas uma vez assim que o componente for exibido em tela

//se o usuario nao tiver dado like na questao ainda, nao vai retornar nada, se nao retornar nada nao vai ter como acessar a posicao 0 e sim retornar nulo
//se o usuario  tiver dado like na questao, vai acessar a posicao 0 