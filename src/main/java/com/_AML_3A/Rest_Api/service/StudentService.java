package com._AML_3A.Rest_Api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._AML_3A.Rest_Api.model.Student;
import com._AML_3A.Rest_Api.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repository;

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Student getStudentById(int id) {
        return repository.findById(id).orElse(null);
    }

    public Student saveStudent(Student student) {
        return repository.save(student);
    }

    public Student updateStudent(int id, Student student) {
        Student s = repository.findById(id).orElse(null);

        if (s != null) {
            s.setName(student.getName());
            s.setEmail(student.getEmail());
            return repository.save(s);
        }

        return null;
    }

    public void deleteStudent(int id) {
        repository.deleteById(id);
    }
}