package com.movierentalservice.config;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.movierentalservice.entity.Actor;
import com.movierentalservice.entity.Category;
import com.movierentalservice.entity.Movie;
import com.movierentalservice.entity.Rating;
import com.movierentalservice.entity.Rental;
import com.movierentalservice.entity.User;
import com.movierentalservice.repository.ActorRepository;
import com.movierentalservice.repository.CategoryRepository;
import com.movierentalservice.repository.MovieRepository;
import com.movierentalservice.repository.RatingRepository;
import com.movierentalservice.repository.RentalRepository;
import com.movierentalservice.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final CategoryRepository categoryRepository;
    private final ActorRepository actorRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final RentalRepository rentalRepository;

    // Add these constants at the top of the DataInitializer class
    private static final String INCEPTION_IMG_ID = "inception-123456";
    private static final String AVENGERS_IMG_ID = "avengers-654321";
    private static final String FORREST_GUMP_IMG_ID = "forrest-789012";
    private static final String SHAWSHANK_IMG_ID = "shawshank-345678";
    private static final String DARK_KNIGHT_IMG_ID = "darkknight-901234";
    private static final String PULP_FICTION_IMG_ID = "pulpfiction-567890";
    private static final String GODFATHER_IMG_ID = "godfather-123789";
    private static final String FIGHT_CLUB_IMG_ID = "fightclub-456012";
    private static final String MATRIX_IMG_ID = "matrix-789345";
    private static final String TITANIC_IMG_ID = "titanic-012678";
    private static final String SILENCE_LAMBS_IMG_ID = "silencelambs-345901";
    private static final String GOODFELLAS_IMG_ID = "goodfellas-678234";
    private static final String LOTR_IMG_ID = "lotr-901567";
    private static final String STAR_WARS_IMG_ID = "starwars-234890";
    private static final String WOLF_WALL_ST_IMG_ID = "wolfwallst-567123";
    private static final String LA_LA_LAND_IMG_ID = "lalaland-890456";

    @Bean
    @Profile("!prod") // Don't run in production
    public CommandLineRunner initData() {
        return args -> {
            if (movieRepository.count() > 0) {
                log.info("Database already contains data, skipping initialization");
                return;
            }
            
            log.info("Starting data initialization...");
            
            initCategories();
            initActors();
            initMovies();
            initUsers();
            initRatingsAndRentals();
            
            log.info("Data initialization completed");
        };
    }
    
    @Transactional
    void initCategories() {
        List<Category> categories = Arrays.asList(
            Category.builder().name("Action").build(),
            Category.builder().name("Comedy").build(),
            Category.builder().name("Drama").build(),
            Category.builder().name("Sci-Fi").build(),
            Category.builder().name("Horror").build(),
            Category.builder().name("Romance").build(),
            Category.builder().name("Thriller").build(),
            Category.builder().name("Documentary").build(),
            Category.builder().name("Animation").build(),
            Category.builder().name("Adventure").build(),
            Category.builder().name("Fantasy").build(),
            Category.builder().name("Crime").build(),
            Category.builder().name("Mystery").build(),
            Category.builder().name("Biography").build(),
            Category.builder().name("Family").build(),
            Category.builder().name("History").build(),
            Category.builder().name("War").build(),
            Category.builder().name("Music").build(),
            Category.builder().name("Western").build(),
            Category.builder().name("Sport").build()
        );
        
        categoryRepository.saveAll(categories);
        log.info("Categories initialized: {}", categories.size());
    }
    
    @Transactional
    void initActors() {
        List<Actor> actors = Arrays.asList(
            Actor.builder().name("Tom Hanks").build(),
            Actor.builder().name("Leonardo DiCaprio").build(),
            Actor.builder().name("Meryl Streep").build(),
            Actor.builder().name("Scarlett Johansson").build(),
            Actor.builder().name("Robert Downey Jr.").build(),
            Actor.builder().name("Jennifer Lawrence").build(),
            Actor.builder().name("Denzel Washington").build(),
            Actor.builder().name("Brad Pitt").build(),
            Actor.builder().name("Emma Stone").build(),
            Actor.builder().name("Johnny Depp").build(),
            Actor.builder().name("Cate Blanchett").build(),
            Actor.builder().name("Chris Hemsworth").build(),
            Actor.builder().name("Margot Robbie").build(),
            Actor.builder().name("Chris Evans").build(),
            Actor.builder().name("Anne Hathaway").build(),
            Actor.builder().name("Tom Holland").build(),
            Actor.builder().name("Viola Davis").build(),
            Actor.builder().name("Ryan Gosling").build(),
            Actor.builder().name("Kate Winslet").build(),
            Actor.builder().name("Samuel L. Jackson").build(),
            Actor.builder().name("Zendaya").build(),
            Actor.builder().name("Hugh Jackman").build(),
            Actor.builder().name("Jennifer Aniston").build(),
            Actor.builder().name("Dwayne Johnson").build(),
            Actor.builder().name("Emma Watson").build(),
            Actor.builder().name("Tom Cruise").build(),
            Actor.builder().name("Gal Gadot").build(),
            Actor.builder().name("Daniel Craig").build(),
            Actor.builder().name("Angelina Jolie").build(),
            Actor.builder().name("Chris Pratt").build()
        );
        
        actorRepository.saveAll(actors);
        log.info("Actors initialized: {}", actors.size());
    }
    
    @Transactional
    void initMovies() {
        // Get categories
        Category action = categoryRepository.findByName("Action")
            .orElseThrow(() -> new RuntimeException("Category 'Action' not found"));
        Category comedy = categoryRepository.findByName("Comedy")
            .orElseThrow(() -> new RuntimeException("Category 'Comedy' not found"));
        Category drama = categoryRepository.findByName("Drama")
            .orElseThrow(() -> new RuntimeException("Category 'Drama' not found"));
        Category sciFi = categoryRepository.findByName("Sci-Fi")
            .orElseThrow(() -> new RuntimeException("Category 'Sci-Fi' not found"));
        Category horror = categoryRepository.findByName("Horror")
            .orElseThrow(() -> new RuntimeException("Category 'Horror' not found"));
        Category romance = categoryRepository.findByName("Romance")
            .orElseThrow(() -> new RuntimeException("Category 'Romance' not found"));
        Category thriller = categoryRepository.findByName("Thriller")
            .orElseThrow(() -> new RuntimeException("Category 'Thriller' not found"));
        Category documentary = categoryRepository.findByName("Documentary")
            .orElseThrow(() -> new RuntimeException("Category 'Documentary' not found"));
        Category animation = categoryRepository.findByName("Animation")
            .orElseThrow(() -> new RuntimeException("Category 'Animation' not found"));
        Category adventure = categoryRepository.findByName("Adventure")
            .orElseThrow(() -> new RuntimeException("Category 'Adventure' not found"));
        Category fantasy = categoryRepository.findByName("Fantasy")
            .orElseThrow(() -> new RuntimeException("Category 'Fantasy' not found"));
        Category crime = categoryRepository.findByName("Crime")
            .orElseThrow(() -> new RuntimeException("Category 'Crime' not found"));
        
        // Get actors
        Actor tomHanks = actorRepository.findByName("Tom Hanks")
            .orElseThrow(() -> new RuntimeException("Actor 'Tom Hanks' not found"));
        Actor leoCaprio = actorRepository.findByName("Leonardo DiCaprio")
            .orElseThrow(() -> new RuntimeException("Actor 'Leonardo DiCaprio' not found"));
        Actor merylStreep = actorRepository.findByName("Meryl Streep")
            .orElseThrow(() -> new RuntimeException("Actor 'Meryl Streep' not found"));
        Actor scarlettJ = actorRepository.findByName("Scarlett Johansson")
            .orElseThrow(() -> new RuntimeException("Actor 'Scarlett Johansson' not found"));
        Actor robertDJ = actorRepository.findByName("Robert Downey Jr.")
            .orElseThrow(() -> new RuntimeException("Actor 'Robert Downey Jr.' not found"));
        Actor jenniferL = actorRepository.findByName("Jennifer Lawrence")
            .orElseThrow(() -> new RuntimeException("Actor 'Jennifer Lawrence' not found"));
        Actor denzelW = actorRepository.findByName("Denzel Washington")
            .orElseThrow(() -> new RuntimeException("Actor 'Denzel Washington' not found"));
        Actor bradPitt = actorRepository.findByName("Brad Pitt")
            .orElseThrow(() -> new RuntimeException("Actor 'Brad Pitt' not found"));
        Actor emmaStone = actorRepository.findByName("Emma Stone")
            .orElseThrow(() -> new RuntimeException("Actor 'Emma Stone' not found"));
        Actor johnnyDepp = actorRepository.findByName("Johnny Depp")
            .orElseThrow(() -> new RuntimeException("Actor 'Johnny Depp' not found"));
        Actor chrisHemsworth = actorRepository.findByName("Chris Hemsworth")
            .orElseThrow(() -> new RuntimeException("Actor 'Chris Hemsworth' not found"));
        Actor chrisEvans = actorRepository.findByName("Chris Evans")
            .orElseThrow(() -> new RuntimeException("Actor 'Chris Evans' not found"));
        Actor margotRobbie = actorRepository.findByName("Margot Robbie")
            .orElseThrow(() -> new RuntimeException("Actor 'Margot Robbie' not found"));
        
        // Create movies without relationships first
        List<Movie> movies = Arrays.asList(
            // Original movies
            Movie.builder()
                .title("Inception")
                .description("A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.")
                .releaseYear(2010)
                .director("Christopher Nolan")
                .duration(148) // 2 hours 28 minutes
                .stockQuantity(10)
                .imageId(INCEPTION_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("The Avengers")
                .description("Earth's mightiest heroes must come together and learn to fight as a team.")
                .releaseYear(2012)
                .director("Joss Whedon")
                .duration(143) // 2 hours 23 minutes
                .stockQuantity(15)
                .imageId(AVENGERS_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("Forrest Gump")
                .description("The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.")
                .releaseYear(1994)
                .director("Robert Zemeckis")
                .duration(142) // 2 hours 22 minutes
                .stockQuantity(8)
                .imageId(FORREST_GUMP_IMG_ID)
                .build(),
                
            // Additional movies
            Movie.builder()
                .title("The Shawshank Redemption")
                .description("Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.")
                .releaseYear(1994)
                .director("Frank Darabont")
                .duration(142)
                .stockQuantity(7)
                .imageId(SHAWSHANK_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("The Dark Knight")
                .description("When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.")
                .releaseYear(2008)
                .director("Christopher Nolan")
                .duration(152)
                .stockQuantity(12)
                .imageId(DARK_KNIGHT_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("Pulp Fiction")
                .description("The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.")
                .releaseYear(1994)
                .director("Quentin Tarantino")
                .duration(154)
                .stockQuantity(6)
                .imageId(PULP_FICTION_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("The Godfather")
                .description("The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.")
                .releaseYear(1972)
                .director("Francis Ford Coppola")
                .duration(175)
                .stockQuantity(5)
                .imageId(GODFATHER_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("Fight Club")
                .description("An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.")
                .releaseYear(1999)
                .director("David Fincher")
                .duration(139)
                .stockQuantity(9)
                .imageId(FIGHT_CLUB_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("The Matrix")
                .description("A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.")
                .releaseYear(1999)
                .director("The Wachowskis")
                .duration(136)
                .stockQuantity(14)
                .imageId(MATRIX_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("Titanic")
                .description("A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.")
                .releaseYear(1997)
                .director("James Cameron")
                .duration(194)
                .stockQuantity(8)
                .imageId(TITANIC_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("The Silence of the Lambs")
                .description("A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.")
                .releaseYear(1991)
                .director("Jonathan Demme")
                .duration(118)
                .stockQuantity(6)
                .imageId(SILENCE_LAMBS_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("Goodfellas")
                .description("The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.")
                .releaseYear(1990)
                .director("Martin Scorsese")
                .duration(146)
                .stockQuantity(7)
                .imageId(GOODFELLAS_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("The Lord of the Rings: The Fellowship of the Ring")
                .description("A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.")
                .releaseYear(2001)
                .director("Peter Jackson")
                .duration(178)
                .stockQuantity(10)
                .imageId(LOTR_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("Star Wars: Episode IV - A New Hope")
                .description("Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.")
                .releaseYear(1977)
                .director("George Lucas")
                .duration(121)
                .stockQuantity(11)
                .imageId(STAR_WARS_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("The Wolf of Wall Street")
                .description("Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.")
                .releaseYear(2013)
                .director("Martin Scorsese")
                .duration(180)
                .stockQuantity(9)
                .imageId(WOLF_WALL_ST_IMG_ID)
                .build(),
                
            Movie.builder()
                .title("La La Land")
                .description("While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.")
                .releaseYear(2016)
                .director("Damien Chazelle")
                .duration(128)
                .stockQuantity(12)
                .imageId(LA_LA_LAND_IMG_ID)
                .build()
        );
        
        // Save movies first without relationships
        movieRepository.saveAll(movies);
        
        // Now retrieve the saved movies to set up relationships
        Movie inception = movieRepository.findByTitle("Inception")
            .orElseThrow(() -> new RuntimeException("Movie 'Inception' not found"));
        Movie avengers = movieRepository.findByTitle("The Avengers")
            .orElseThrow(() -> new RuntimeException("Movie 'The Avengers' not found"));
        Movie forrestGump = movieRepository.findByTitle("Forrest Gump")
            .orElseThrow(() -> new RuntimeException("Movie 'Forrest Gump' not found"));
        Movie shawshank = movieRepository.findByTitle("The Shawshank Redemption")
            .orElseThrow(() -> new RuntimeException("Movie 'The Shawshank Redemption' not found"));
        Movie darkKnight = movieRepository.findByTitle("The Dark Knight")
            .orElseThrow(() -> new RuntimeException("Movie 'The Dark Knight' not found"));
        Movie pulpFiction = movieRepository.findByTitle("Pulp Fiction")
            .orElseThrow(() -> new RuntimeException("Movie 'Pulp Fiction' not found"));
        Movie godfather = movieRepository.findByTitle("The Godfather")
            .orElseThrow(() -> new RuntimeException("Movie 'The Godfather' not found"));
        Movie fightClub = movieRepository.findByTitle("Fight Club")
            .orElseThrow(() -> new RuntimeException("Movie 'Fight Club' not found"));
        Movie matrix = movieRepository.findByTitle("The Matrix")
            .orElseThrow(() -> new RuntimeException("Movie 'The Matrix' not found"));
        Movie titanic = movieRepository.findByTitle("Titanic")
            .orElseThrow(() -> new RuntimeException("Movie 'Titanic' not found"));
        Movie silenceOfTheLambs = movieRepository.findByTitle("The Silence of the Lambs")
            .orElseThrow(() -> new RuntimeException("Movie 'The Silence of the Lambs' not found"));
        Movie goodfellas = movieRepository.findByTitle("Goodfellas")
            .orElseThrow(() -> new RuntimeException("Movie 'Goodfellas' not found"));
        Movie lotr = movieRepository.findByTitle("The Lord of the Rings: The Fellowship of the Ring")
            .orElseThrow(() -> new RuntimeException("Movie 'The Lord of the Rings: The Fellowship of the Ring' not found"));
        Movie starWars = movieRepository.findByTitle("Star Wars: Episode IV - A New Hope")
            .orElseThrow(() -> new RuntimeException("Movie 'Star Wars: Episode IV - A New Hope' not found"));
        Movie wolfOfWallStreet = movieRepository.findByTitle("The Wolf of Wall Street")
            .orElseThrow(() -> new RuntimeException("Movie 'The Wolf of Wall Street' not found"));
        Movie laLaLand = movieRepository.findByTitle("La La Land")
            .orElseThrow(() -> new RuntimeException("Movie 'La La Land' not found"));
        
        // Set up relationships
        inception.setActors(new HashSet<>(Arrays.asList(leoCaprio)));
        inception.setCategories(new HashSet<>(Arrays.asList(action, sciFi, thriller)));
        
        avengers.setActors(new HashSet<>(Arrays.asList(robertDJ, scarlettJ, chrisEvans)));
        avengers.setCategories(new HashSet<>(Arrays.asList(action, sciFi, adventure)));
        
        forrestGump.setActors(new HashSet<>(Arrays.asList(tomHanks)));
        forrestGump.setCategories(new HashSet<>(Arrays.asList(drama, romance)));
        
        shawshank.setActors(new HashSet<>(Arrays.asList(denzelW)));
        shawshank.setCategories(new HashSet<>(Arrays.asList(drama)));
        
        darkKnight.setActors(new HashSet<>(Arrays.asList(bradPitt, johnnyDepp)));
        darkKnight.setCategories(new HashSet<>(Arrays.asList(action, crime, drama)));
        
        pulpFiction.setActors(new HashSet<>(Arrays.asList(bradPitt, scarlettJ)));
        pulpFiction.setCategories(new HashSet<>(Arrays.asList(crime, drama)));
        
        godfather.setActors(new HashSet<>(Arrays.asList(denzelW, robertDJ)));
        godfather.setCategories(new HashSet<>(Arrays.asList(crime, drama)));
        
        fightClub.setActors(new HashSet<>(Arrays.asList(bradPitt)));
        fightClub.setCategories(new HashSet<>(Arrays.asList(drama, thriller)));
        
        matrix.setActors(new HashSet<>(Arrays.asList(leoCaprio, merylStreep)));
        matrix.setCategories(new HashSet<>(Arrays.asList(action, sciFi)));
        
        titanic.setActors(new HashSet<>(Arrays.asList(leoCaprio, merylStreep)));
        titanic.setCategories(new HashSet<>(Arrays.asList(drama, romance)));
        
        silenceOfTheLambs.setActors(new HashSet<>(Arrays.asList(johnnyDepp, jenniferL)));
        silenceOfTheLambs.setCategories(new HashSet<>(Arrays.asList(crime, drama, thriller)));
        
        goodfellas.setActors(new HashSet<>(Arrays.asList(robertDJ, jenniferL)));
        goodfellas.setCategories(new HashSet<>(Arrays.asList(crime, drama)));
        
        lotr.setActors(new HashSet<>(Arrays.asList(chrisHemsworth, margotRobbie)));
        lotr.setCategories(new HashSet<>(Arrays.asList(adventure, drama, fantasy)));
        
        starWars.setActors(new HashSet<>(Arrays.asList(chrisHemsworth, chrisEvans)));
        starWars.setCategories(new HashSet<>(Arrays.asList(action, adventure, fantasy, sciFi)));
        
        wolfOfWallStreet.setActors(new HashSet<>(Arrays.asList(leoCaprio, margotRobbie)));
        wolfOfWallStreet.setCategories(new HashSet<>(Arrays.asList(crime, drama)));
        
        laLaLand.setActors(new HashSet<>(Arrays.asList(emmaStone, jenniferL)));
        laLaLand.setCategories(new HashSet<>(Arrays.asList(comedy, drama, romance)));
        
        // Update with relationships
        List<Movie> updatedMovies = Arrays.asList(
            inception, avengers, forrestGump, shawshank, darkKnight,
            pulpFiction, godfather, fightClub, matrix, titanic,
            silenceOfTheLambs, goodfellas, lotr, starWars, wolfOfWallStreet, laLaLand
        );
        movieRepository.saveAll(updatedMovies);
        
        log.info("Movies initialized: {}", updatedMovies.size());
    }
    
    @Transactional
    void initUsers() {
        List<User> users = Arrays.asList(
            User.builder()
                .email("john@example.com")
                .password("Aa123456")
                .fullName("John Doe")
                .phoneNumber("555-123-4567")
                .address("123 Main St, Springfield, IL 62701")
                .role(User.Role.USER)
                .build(),
                
            User.builder()
                .email("jane@example.com")
                .password("Aa123456")
                .fullName("Jane Smith")
                .phoneNumber("555-987-6543")
                .address("456 Oak Ave, Springfield, IL 62702")
                .role(User.Role.USER)
                .build(),
                
            User.builder()
                .email("admin@example.com")
                .password("Aa123456")
                .fullName("Admin User")
                .phoneNumber("555-555-5555")
                .address("789 Admin Blvd, Springfield, IL 62703")
                .role(User.Role.ADMIN)
                .build(),
                
            // Additional users
            User.builder()
                .email("michael@example.com")
                .password("Aa123456")
                .fullName("Michael Johnson")
                .phoneNumber("555-222-3333")
                .address("890 Pine Rd, Springfield, IL 62704")
                .role(User.Role.USER)
                .build(),
                
            User.builder()
                .email("sarah@example.com")
                .password("Aa123456")
                .fullName("Sarah Williams")
                .phoneNumber("555-444-5555")
                .address("567 Maple Dr, Springfield, IL 62705")
                .role(User.Role.USER)
                .build(),
                
            User.builder()
                .email("david@example.com")
                .password("Aa123456")
                .fullName("David Brown")
                .phoneNumber("555-666-7777")
                .address("234 Cedar Ln, Springfield, IL 62706")
                .role(User.Role.USER)
                .build(),
                
            User.builder()
                .email("emily@example.com")
                .password("Aa123456")
                .fullName("Emily Davis")
                .phoneNumber("555-888-9999")
                .address("901 Elm St, Springfield, IL 62707")
                .role(User.Role.USER)
                .build(),
                
            User.builder()
                .email("robert@example.com")
                .password("Aa123456")
                .fullName("Robert Miller")
                .phoneNumber("555-111-2222")
                .address("345 Walnut Ave, Springfield, IL 62708")
                .role(User.Role.USER)
                .build(),
                
            User.builder()
                .email("jessica@example.com")
                .password("Aa123456")
                .fullName("Jessica Wilson")
                .phoneNumber("555-333-4444")
                .address("678 Birch Rd, Springfield, IL 62709")
                .role(User.Role.USER)
                .build(),
                
            User.builder()
                .email("chris@example.com")
                .password("Aa123456")
                .fullName("Christopher Taylor")
                .phoneNumber("555-999-0000")
                .address("789 Spruce Dr, Springfield, IL 62710")
                .role(User.Role.USER)
                .build(),
                
            User.builder()
                .email("amanda@example.com")
                .password("Aa123456")
                .fullName("Amanda Moore")
                .phoneNumber("555-222-1111")
                .address("456 Poplar Ln, Springfield, IL 62711")
                .role(User.Role.USER)
                .build(),
                
            User.builder()
                .email("manager@example.com")
                .password("Aa123456")
                .fullName("Manager User")
                .phoneNumber("555-777-8888")
                .address("123 Manager St, Springfield, IL 62712")
                .role(User.Role.ADMIN)
                .build()
        );
        
        userRepository.saveAll(users);
        log.info("Users initialized: {}", users.size());
    }
    
    @Transactional
    void initRatingsAndRentals() {
        // Fetch users
        User john = userRepository.findByEmail("john@example.com")
            .orElseThrow(() -> new RuntimeException("User 'john@example.com' not found"));
        User jane = userRepository.findByEmail("jane@example.com")
            .orElseThrow(() -> new RuntimeException("User 'jane@example.com' not found"));
        User michael = userRepository.findByEmail("michael@example.com")
            .orElseThrow(() -> new RuntimeException("User 'michael@example.com' not found"));
        User sarah = userRepository.findByEmail("sarah@example.com")
            .orElseThrow(() -> new RuntimeException("User 'sarah@example.com' not found"));
        User david = userRepository.findByEmail("david@example.com")
            .orElseThrow(() -> new RuntimeException("User 'david@example.com' not found"));
        User emily = userRepository.findByEmail("emily@example.com")
            .orElseThrow(() -> new RuntimeException("User 'emily@example.com' not found"));
        User robert = userRepository.findByEmail("robert@example.com")
            .orElseThrow(() -> new RuntimeException("User 'robert@example.com' not found"));
        User jessica = userRepository.findByEmail("jessica@example.com")
            .orElseThrow(() -> new RuntimeException("User 'jessica@example.com' not found"));
        
        // Fetch movies
        Movie inception = movieRepository.findByTitle("Inception")
            .orElseThrow(() -> new RuntimeException("Movie 'Inception' not found"));
        Movie avengers = movieRepository.findByTitle("The Avengers")
            .orElseThrow(() -> new RuntimeException("Movie 'The Avengers' not found"));
        Movie forrestGump = movieRepository.findByTitle("Forrest Gump")
            .orElseThrow(() -> new RuntimeException("Movie 'Forrest Gump' not found"));
        Movie shawshank = movieRepository.findByTitle("The Shawshank Redemption")
            .orElseThrow(() -> new RuntimeException("Movie 'The Shawshank Redemption' not found"));
        Movie darkKnight = movieRepository.findByTitle("The Dark Knight")
            .orElseThrow(() -> new RuntimeException("Movie 'The Dark Knight' not found"));
        Movie pulpFiction = movieRepository.findByTitle("Pulp Fiction")
            .orElseThrow(() -> new RuntimeException("Movie 'Pulp Fiction' not found"));
        Movie godfather = movieRepository.findByTitle("The Godfather")
            .orElseThrow(() -> new RuntimeException("Movie 'The Godfather' not found"));
        Movie fightClub = movieRepository.findByTitle("Fight Club")
            .orElseThrow(() -> new RuntimeException("Movie 'Fight Club' not found"));
        Movie matrix = movieRepository.findByTitle("The Matrix")
            .orElseThrow(() -> new RuntimeException("Movie 'The Matrix' not found"));
        Movie titanic = movieRepository.findByTitle("Titanic")
            .orElseThrow(() -> new RuntimeException("Movie 'Titanic' not found"));
        Movie silenceOfTheLambs = movieRepository.findByTitle("The Silence of the Lambs")
            .orElseThrow(() -> new RuntimeException("Movie 'The Silence of the Lambs' not found"));
        Movie lotr = movieRepository.findByTitle("The Lord of the Rings: The Fellowship of the Ring")
            .orElseThrow(() -> new RuntimeException("Movie 'The Lord of the Rings: The Fellowship of the Ring' not found"));
        Movie starWars = movieRepository.findByTitle("Star Wars: Episode IV - A New Hope")
            .orElseThrow(() -> new RuntimeException("Movie 'Star Wars: Episode IV - A New Hope' not found"));
        
        // Initialize ratings
        List<Rating> ratings = new java.util.ArrayList<>();
        
        // Original ratings
        ratings.addAll(Arrays.asList(
            Rating.builder().user(john).movie(inception).rating(5).build(),
            Rating.builder().user(jane).movie(inception).rating(4).build(),
            Rating.builder().user(john).movie(avengers).rating(4).build(),
            Rating.builder().user(jane).movie(forrestGump).rating(5).build()
        ));
        
        // Additional ratings for original and new users
        ratings.addAll(Arrays.asList(
            // John's additional ratings
            Rating.builder().user(john).movie(darkKnight).rating(5).build(),
            Rating.builder().user(john).movie(pulpFiction).rating(4).build(),
            Rating.builder().user(john).movie(shawshank).rating(5).build(),
            Rating.builder().user(john).movie(matrix).rating(5).build(),
            Rating.builder().user(john).movie(lotr).rating(4).build(),
            
            // Jane's additional ratings
            Rating.builder().user(jane).movie(darkKnight).rating(4).build(),
            Rating.builder().user(jane).movie(titanic).rating(5).build(),
            Rating.builder().user(jane).movie(matrix).rating(3).build(),
            Rating.builder().user(jane).movie(pulpFiction).rating(4).build(),
            
            // Michael's ratings
            Rating.builder().user(michael).movie(inception).rating(5).build(),
            Rating.builder().user(michael).movie(avengers).rating(5).build(),
            Rating.builder().user(michael).movie(darkKnight).rating(5).build(),
            Rating.builder().user(michael).movie(matrix).rating(4).build(),
            Rating.builder().user(michael).movie(starWars).rating(5).build(),
            
            // Sarah's ratings
            Rating.builder().user(sarah).movie(forrestGump).rating(5).build(),
            Rating.builder().user(sarah).movie(titanic).rating(5).build(),
            Rating.builder().user(sarah).movie(pulpFiction).rating(3).build(),
            Rating.builder().user(sarah).movie(avengers).rating(4).build(),
            
            // David's ratings
            Rating.builder().user(david).movie(godfather).rating(5).build(),
            Rating.builder().user(david).movie(inception).rating(4).build(),
            Rating.builder().user(david).movie(darkKnight).rating(5).build(),
            Rating.builder().user(david).movie(pulpFiction).rating(5).build(),
            
            // Emily's ratings
            Rating.builder().user(emily).movie(titanic).rating(5).build(),
            Rating.builder().user(emily).movie(forrestGump).rating(5).build(),
            Rating.builder().user(emily).movie(lotr).rating(4).build(),
            
            // Robert's ratings
            Rating.builder().user(robert).movie(matrix).rating(5).build(),
            Rating.builder().user(robert).movie(starWars).rating(5).build(),
            Rating.builder().user(robert).movie(avengers).rating(5).build(),
            Rating.builder().user(robert).movie(inception).rating(4).build(),
            
            // Jessica's ratings
            Rating.builder().user(jessica).movie(titanic).rating(5).build(),
            Rating.builder().user(jessica).movie(fightClub).rating(3).build(),
            Rating.builder().user(jessica).movie(silenceOfTheLambs).rating(4).build()
        ));
        
        ratingRepository.saveAll(ratings);
        log.info("Ratings initialized: {}", ratings.size());
        
        // Initialize rentals with specific times
        LocalDateTime now = LocalDateTime.now();
        List<Rental> rentals = new java.util.ArrayList<>();
        
        // Original rentals for John
        rentals.addAll(Arrays.asList(
            Rental.builder()
                .user(john)
                .movie(inception)
                .rentalCode("A7B23C")
                .rentalDate(now.minusDays(5).withHour(14).withMinute(30))
                .returnDate(now.plusDays(2).withHour(18).withMinute(45))
                .status(Rental.RentalStatus.TAKEN)
                .build(),
                
            Rental.builder()
                .user(john)
                .movie(avengers)
                .rentalCode("XY89Z5")
                .rentalDate(now.minusDays(15).withHour(10).withMinute(15))
                .returnDate(now.minusDays(8).withHour(16).withMinute(20))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(john)
                .movie(forrestGump)
                .rentalCode("QW3RT7")
                .rentalDate(now.minusDays(3).withHour(9).withMinute(45))
                .returnDate(now.plusDays(4).withHour(17).withMinute(30))
                .status(Rental.RentalStatus.TAKEN)
                .build(),
                
            // Additional rentals for John's history
            Rental.builder()
                .user(john)
                .movie(inception)
                .rentalCode("AS56DF")
                .rentalDate(now.minusDays(60).withHour(11).withMinute(20))
                .returnDate(now.minusDays(55).withHour(12).withMinute(15))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(john)
                .movie(inception)
                .rentalCode("ZX12CV")
                .rentalDate(now.minusDays(45).withHour(13).withMinute(50))
                .returnDate(now.minusDays(40).withHour(15).withMinute(25))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(john)
                .movie(avengers)
                .rentalCode("PO87IU")
                .rentalDate(now.minusDays(90).withHour(16).withMinute(10))
                .returnDate(now.minusDays(85).withHour(13).withMinute(40))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(john)
                .movie(forrestGump)
                .rentalCode("LK4J2H")
                .rentalDate(now.minusDays(120).withHour(10).withMinute(30))
                .returnDate(now.minusDays(115).withHour(14).withMinute(15))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(john)
                .movie(avengers)
                .rentalCode("M5N6B7")
                .rentalDate(now.minusDays(30).withHour(15).withMinute(45))
                .returnDate(now.minusDays(28).withHour(16).withMinute(30))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            // ORDERED rentals for John
            Rental.builder()
                .user(john)
                .movie(forrestGump)
                .rentalCode("8G9F3E")
                .rentalDate(now.withHour(9).withMinute(10))
                .returnDate(now.plusDays(7).withHour(18).withMinute(0))
                .status(Rental.RentalStatus.ORDERED)
                .build(),
                
            Rental.builder()
                .user(john)
                .movie(inception)
                .rentalCode("2D1S4A")
                .rentalDate(now.minusDays(1).withHour(11).withMinute(25))
                .returnDate(now.plusDays(6).withHour(19).withMinute(30))
                .status(Rental.RentalStatus.ORDERED)
                .build(),
                
            // CANCELLED rentals for John
            Rental.builder()
                .user(john)
                .movie(avengers)
                .rentalCode("QZ5WX3")
                .rentalDate(now.minusDays(25).withHour(14).withMinute(15))
                .returnDate(null)
                .status(Rental.RentalStatus.CANCELLED)
                .build(),
                
            Rental.builder()
                .user(john)
                .movie(forrestGump)
                .rentalCode("ERTYU9")
                .rentalDate(now.minusDays(75).withHour(16).withMinute(40))
                .returnDate(null)
                .status(Rental.RentalStatus.CANCELLED)
                .build(),
                
            // Original rental for Jane
            Rental.builder()
                .user(jane)
                .movie(avengers)
                .rentalCode("P2L4K7")
                .rentalDate(now.minusDays(10).withHour(10).withMinute(20))
                .returnDate(now.minusDays(4).withHour(11).withMinute(45))
                .status(Rental.RentalStatus.RETURNED)
                .build()
        ));
        
        // Additional rentals for existing and new users
        rentals.addAll(Arrays.asList(
            // Jane's additional rentals
            Rental.builder()
                .user(jane)
                .movie(titanic)
                .rentalCode("JN56TI")
                .rentalDate(now.minusDays(20).withHour(13).withMinute(15))
                .returnDate(now.minusDays(15).withHour(15).withMinute(30))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(jane)
                .movie(darkKnight)
                .rentalCode("JN78DK")
                .rentalDate(now.minusDays(2).withHour(16).withMinute(45))
                .returnDate(now.plusDays(5).withHour(17).withMinute(0))
                .status(Rental.RentalStatus.TAKEN)
                .build(),
                
            // Michael's rentals
            Rental.builder()
                .user(michael)
                .movie(inception)
                .rentalCode("MI23IN")
                .rentalDate(now.minusDays(15).withHour(11).withMinute(30))
                .returnDate(now.minusDays(9).withHour(14).withMinute(15))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(michael)
                .movie(matrix)
                .rentalCode("MI45MT")
                .rentalDate(now.minusDays(7).withHour(9).withMinute(45))
                .returnDate(now.minusDays(2).withHour(10).withMinute(30))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(michael)
                .movie(starWars)
                .rentalCode("MI67SW")
                .rentalDate(now.minusDays(1).withHour(12).withMinute(0))
                .returnDate(now.plusDays(6).withHour(15).withMinute(15))
                .status(Rental.RentalStatus.TAKEN)
                .build(),
                
            // Sarah's rentals
            Rental.builder()
                .user(sarah)
                .movie(titanic)
                .rentalCode("SA34TI")
                .rentalDate(now.minusDays(30).withHour(15).withMinute(20))
                .returnDate(now.minusDays(25).withHour(17).withMinute(45))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(sarah)
                .movie(forrestGump)
                .rentalCode("SA56FG")
                .rentalDate(now.minusDays(10).withHour(10).withMinute(10))
                .returnDate(now.minusDays(5).withHour(11).withMinute(30))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(sarah)
                .movie(pulpFiction)
                .rentalCode("SA78PF")
                .rentalDate(now.withHour(13).withMinute(45))
                .returnDate(now.plusDays(7).withHour(18).withMinute(30))
                .status(Rental.RentalStatus.ORDERED)
                .build(),
                
            // David's rentals
            Rental.builder()
                .user(david)
                .movie(godfather)
                .rentalCode("DA12GF")
                .rentalDate(now.minusDays(45).withHour(14).withMinute(0))
                .returnDate(now.minusDays(40).withHour(16).withMinute(25))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(david)
                .movie(pulpFiction)
                .rentalCode("DA34PF")
                .rentalDate(now.minusDays(20).withHour(11).withMinute(15))
                .returnDate(now.minusDays(15).withHour(12).withMinute(40))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(david)
                .movie(darkKnight)
                .rentalCode("DA56DK")
                .rentalDate(now.minusDays(5).withHour(9).withMinute(30))
                .returnDate(now.plusDays(2).withHour(19).withMinute(15))
                .status(Rental.RentalStatus.TAKEN)
                .build(),
                
            // Emily's rentals
            Rental.builder()
                .user(emily)
                .movie(titanic)
                .rentalCode("EM23TI")
                .rentalDate(now.minusDays(60).withHour(16).withMinute(20))
                .returnDate(now.minusDays(55).withHour(14).withMinute(45))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(emily)
                .movie(forrestGump)
                .rentalCode("EM45FG")
                .rentalDate(now.minusDays(3).withHour(10).withMinute(40))
                .returnDate(now.plusDays(4).withHour(17).withMinute(15))
                .status(Rental.RentalStatus.TAKEN)
                .build(),
                
            // Robert's rentals
            Rental.builder()
                .user(robert)
                .movie(matrix)
                .rentalCode("RO12MT")
                .rentalDate(now.minusDays(30).withHour(13).withMinute(30))
                .returnDate(now.minusDays(25).withHour(15).withMinute(0))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(robert)
                .movie(starWars)
                .rentalCode("RO34SW")
                .rentalDate(now.minusDays(15).withHour(11).withMinute(10))
                .returnDate(now.minusDays(9).withHour(12).withMinute(45))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(robert)
                .movie(avengers)
                .rentalCode("RO56AV")
                .rentalDate(now.minusDays(2).withHour(15).withMinute(55))
                .returnDate(now.plusDays(5).withHour(18).withMinute(20))
                .status(Rental.RentalStatus.TAKEN)
                .build(),
                
            // Jessica's rentals
            Rental.builder()
                .user(jessica)
                .movie(titanic)
                .rentalCode("JE12TI")
                .rentalDate(now.minusDays(90).withHour(12).withMinute(25))
                .returnDate(now.minusDays(85).withHour(10).withMinute(50))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(jessica)
                .movie(silenceOfTheLambs)
                .rentalCode("JE34SL")
                .rentalDate(now.minusDays(10).withHour(14).withMinute(15))
                .returnDate(now.minusDays(5).withHour(16).withMinute(30))
                .status(Rental.RentalStatus.RETURNED)
                .build(),
                
            Rental.builder()
                .user(jessica)
                .movie(fightClub)
                .rentalCode("JE56FC")
                .rentalDate(now.withHour(10).withMinute(0))
                .returnDate(now.plusDays(7).withHour(19).withMinute(0))
                .status(Rental.RentalStatus.ORDERED)
                .build()
        ));
        
        rentalRepository.saveAll(rentals);
        log.info("Rentals initialized: {}", rentals.size());
    }
} 