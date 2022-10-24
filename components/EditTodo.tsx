import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  Button,
  FormLabel,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { TfiPencilAlt, TfiTarget } from 'react-icons/tfi';
import { getAllTodos, updateTodos } from 'services/todo.service'
import { TodoType } from 'types';

const EditTodo = (todo: TodoType) =>{
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description)
  const [taskDateTime, setTaskDateTime] = useState(todo.taskDateTime)
  const [durationTime, setDurationTime] = useState(todo.durationTime)
  const [done, isDone] = useState(todo.done)
  const parse = (val: any) => val.replace(/^\$/, '')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const editModal = useDisclosure()

  const updateTodo = async (todo: TodoType) => {

    todo.done == true ? (isDone(todo.done)) : (isDone(todo.done))

    const data = {
      title: title,
      description: description,
      taskDateTime: taskDateTime.replace('T', ' '),
      durationTime: durationTime,
      done: done
    }
    updateTodos(todo.id, data);
    window.location.reload()
    editModal.onClose()
  }

    return(
      <>
      <span>
      <TfiPencilAlt style={{ fontSize: "22px", color: "#000" }} onClick={editModal.onOpen} />
      </span>
      <Modal isOpen={editModal.isOpen} onClose={editModal.onClose}>
        <ModalOverlay />
            <ModalContent>
              <ModalHeader>Editar Tarefa</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormLabel>Título da Tarefa</FormLabel>
                <Input placeholder='Título da Tarefa' defaultValue={todo.title} onChange={(e) => setTitle(e.target.value)} />
                <FormLabel>Descrição da Tarefa</FormLabel>
                <Input placeholder='Descrição da Tarefa' defaultValue={todo.description} onChange={(e) => setDescription(e.target.value)} />
                <FormLabel>Data e Hora da Terefa</FormLabel>
                <Input type="datetime-local" placeholder='Data e Hora da Tarefa' defaultValue={todo.taskDateTime.replace(' ','T')} onChange={(e) => setTaskDateTime(e.target.value)} />
                <FormLabel>Tempo de Duração da Terefa(minutos)</FormLabel>
                <NumberInput defaultValue={todo.durationTime} min={0} max={240} onChange={(valueString) => setDurationTime(parse(valueString))}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='teal' variant='solid' onClick={() => updateTodo(todo)}>Salvar Tarefa</Button>
              </ModalFooter>
            </ModalContent>
      </Modal>

      </>
    )
}

export default EditTodo