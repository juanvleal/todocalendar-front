import type { NextPage } from 'next'
import Seo from 'components/Seo'
import { useEffect, useState } from 'react'
import { getAllTodos, updateTodos, deleteTodos, createTodos } from 'services/todo.service'
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { BsFillTrashFill, BsCheckCircleFill } from 'react-icons/bs';
import { TfiPencilAlt } from 'react-icons/tfi';
import { CgSandClock } from 'react-icons/cg';
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



interface TodoType {
  id: number;
  title: string;
  description: string;
  done: boolean;
  taskDateTime: String;
  durationTime: number;
}

const Home: NextPage = () => {

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [taskDateTime, setTaskDateTime] = useState('')
  const [durationTime, setDurationTime] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const parse = (val: any) => val.replace(/^\$/, '')
  const createModal = useDisclosure()
  const editModal = useDisclosure()
  const key = todos

  useEffect(() => {
    const getTodos = async () => {
      const response = await getAllTodos();
      setTodos(response);
    };
    getTodos();
  }, []);

  const createTodo = async () => {
    const data = {
      title: title,
      description: description,
      taskDateTime: taskDateTime.replace('T', ' '),
      durationTime: parseInt(durationTime)
    }
    const response = await createTodos(data);
    console.log(response)
    const getTodos = async () => {
      const response = await getAllTodos();
      setTodos(response);
    };
    getTodos();
    createModal.onClose()
  }

  const isDone = async (todo: TodoType) => {
    todo.done = true
    const update = await updateTodos(todo.id, todo)
    const getTodos = async () => {
      const response = await getAllTodos();
      setTodos(response);
    };
    getTodos();
  }

  const deleteTodo = async (todo: TodoType) => {
    const update = await deleteTodos(todo.id)
    const getTodos = async () => {
      const response = await getAllTodos();
      setTodos(response);
    };
    getTodos();
  }

  return (
    <>
      <div className='min-h-screen w-full flex flex-col items-center justify-center bg-teal-700 font-sans'>

        <Seo title='Calendário de Tarefas' description='Calendário para agendamento e consulta de tarefas.' />

        <div className='cursor-pointer flex flex-row items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-full mt-6 mb-6' onClick={createModal.onOpen}>
          <span className='mr-2'>
            <AiOutlinePlusCircle style={{ fontSize: "24px" }} />
          </span>
          <span>
            Adicionar Tarefa
          </span>
        </div>

        {todos.map((todos: TodoType) => (
          <div key={todos.id} className=' items-center bg-gray-100 rounded flex flex-row shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg justify-around'>
            <div className='w-full flex flex-col items-center'>
              <div className='w-full items-center justify-start'>
                <h3 className='text-lg'>
                  {todos.title}
                </h3>
                <span className='text-sm'>
                  {todos.description}
                </span>
              </div>
              <div className='justify-start w-full flex items-center mt-3 -mb-4'>
                <span className='text-gray-500 flex items-center'>
                  <AiOutlineClockCircle className='mr-2' />
                  {todos.taskDateTime}
                </span>
                <span className='ml-4 text-gray-500 flex items-center' >
                  <CgSandClock className='mr-2' />
                  {todos.durationTime} m
                </span>
              </div>
            </div>
            <div className='flex w-1/4 justify-around'>
              <span className='cursor-pointer'>
                <TfiPencilAlt style={{ fontSize: "22px", color: "#000" }} key={todos.id} onClick={editModal.onOpen}/>
              </span>
              {
                todos.done == true ? (
                  <span className='rounded-full cursor-not-allowed'>
                    <BsCheckCircleFill style={{ fontSize: "24px", color: "#00a000" }} />
                  </span>
                ) : (
                  <span className='cursor-pointer hover:bg-green-700 rounded-full'>
                    <AiOutlineCheckCircle style={{ fontSize: "24px", color: "#000" }} onClick={() => isDone(todos)} />
                  </span>
                )
              }
              <span className='cursor-pointer'>
                <BsFillTrashFill style={{ fontSize: "24px", color: "#FF0000" }} onClick={() => deleteTodo(todos)} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={createModal.isOpen} onClose={createModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Tarefa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Título da Tarefa</FormLabel>
            <Input placeholder='Título da Tarefa' onChange={(e) => setTitle(e.target.value)} />
            <FormLabel>Descrição da Tarefa</FormLabel>
            <Input placeholder='Descrição da Tarefa' onChange={(e) => setDescription(e.target.value)} />
            <FormLabel>Data e Hora da Terefa</FormLabel>
            <Input type="datetime-local" placeholder='Data e Hora da Tarefa' onChange={(e) => setTaskDateTime(e.target.value)} />
            <FormLabel>Tempo de Duração da Terefa(minutos)</FormLabel>
            <NumberInput defaultValue={0} min={0} max={240} onChange={(valueString) => setDurationTime(parse(valueString))}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' variant='solid' onClick={createTodo}>Adicionar Tarefa</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={editModal.isOpen} onClose={editModal.onClose}>
        <ModalOverlay />
          <div>
            <ModalContent>
              <ModalHeader>Editar Tarefa</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormLabel>Título da Tarefa</FormLabel>
                <Input placeholder='Título da Tarefa' defaultValue={todos.title} onChange={(e) => setTitle(e.target.value)} />
                <FormLabel>Descrição da Tarefa</FormLabel>
                <Input placeholder='Descrição da Tarefa' defaultValue={todos.description} onChange={(e) => setDescription(e.target.value)} />
                <FormLabel>Data e Hora da Terefa</FormLabel>
                <Input type="datetime-local" placeholder='Data e Hora da Tarefa' value={todos.taskDateTime.replace(' ','T')} onChange={(e) => setTaskDateTime(e.target.value)} />
                <FormLabel>Tempo de Duração da Terefa(minutos)</FormLabel>
                <NumberInput defaultValue={todos.durationTime} min={0} max={240} onChange={(valueString) => setDurationTime(parse(valueString))}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='teal' variant='solid' onClick={createTodo}>Adicionar Tarefa</Button>
              </ModalFooter>
            </ModalContent>
          </div>
      </Modal>
    </>
  )
}

export default Home
