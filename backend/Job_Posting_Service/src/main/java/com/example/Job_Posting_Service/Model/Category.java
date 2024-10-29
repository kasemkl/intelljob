package com.example.Job_Posting_Service.Model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Category {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, unique = true)
        private String name;

        @ManyToOne
        @JoinColumn(name = "parent_category_id")
        private Category parentCategory;

        @OneToMany(mappedBy = "parentCategory")
        private List<Category> subCategories = new ArrayList<>();


}
