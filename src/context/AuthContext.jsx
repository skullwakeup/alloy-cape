import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [authError, setAuthError] = useState(null);


  async function loadProfile(currentUser) {

    if (!currentUser) {

      return null;
    }

    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        role,
        created_at,
        updated_at
      `)
      .eq(
        "id",
        currentUser.id
      )
      .maybeSingle();


    if (error) {

      console.error(
        "PROFILE LOAD ERROR:",
        error
      );

      throw error;
    }


    if (!data) {

      throw new Error(
        "No Alloy Cape profile is configured for this account."
      );
    }


    return data;
  }


  async function signIn(
    email,
    password
  ) {

    setAuthError(null);

    const {
      data,
      error,
    } = await supabase.auth.signInWithPassword({

      email,
      password,

    });


    if (error) {

      setAuthError(
        error.message
      );

      throw error;
    }


    try {

      const currentProfile =
        await loadProfile(
          data.user
        );

      setUser(
        data.user
      );

      setProfile(
        currentProfile
      );

      return data;

    } catch (profileError) {

      console.error(
        "SIGN IN PROFILE ERROR:",
        profileError
      );

      await supabase.auth.signOut();

      setUser(null);
      setProfile(null);

      setAuthError(
        profileError.message
      );

      throw profileError;
    }
  }


  async function signOut() {

    const {
      error,
    } = await supabase.auth.signOut();


    if (error) {

      console.error(
        "SIGN OUT ERROR:",
        error
      );

      throw error;
    }


    setUser(null);
    setProfile(null);
    setAuthError(null);
  }


  useEffect(() => {

    let mounted = true;


    async function initializeAuth() {

      try {

        const {
          data,
          error,
        } = await supabase.auth.getSession();


        if (error) {
          throw error;
        }


        const currentUser =
          data?.session?.user ?? null;


        if (!mounted) {
          return;
        }


        if (!currentUser) {

          setUser(null);
          setProfile(null);

          return;
        }


        const currentProfile =
          await loadProfile(
            currentUser
          );


        if (!mounted) {
          return;
        }


        setUser(
          currentUser
        );

        setProfile(
          currentProfile
        );


      } catch (error) {

        console.error(
          "AUTH INITIALIZATION ERROR:",
          error
        );


        if (mounted) {

          setUser(null);
          setProfile(null);

          setAuthError(
            error.message
          );
        }


      } finally {

        if (mounted) {

          setLoading(false);
        }
      }
    }


    initializeAuth();


    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (event, session) => {

          if (!mounted) {
            return;
          }


          const currentUser =
            session?.user ?? null;


          /*
           * Do not perform the profile query directly
           * inside the Supabase auth callback.
           *
           * Schedule it after the auth event finishes.
           */

          setTimeout(
            async () => {

              if (!mounted) {
                return;
              }


              if (!currentUser) {

                setUser(null);
                setProfile(null);

                return;
              }


              try {

                const currentProfile =
                  await loadProfile(
                    currentUser
                  );


                if (!mounted) {
                  return;
                }


                setUser(
                  currentUser
                );

                setProfile(
                  currentProfile
                );


              } catch (error) {

                console.error(
                  "AUTH PROFILE ERROR:",
                  error
                );


                if (!mounted) {
                  return;
                }


                setUser(null);
                setProfile(null);

                setAuthError(
                  error.message
                );
              }

            },
            0
          );

        }
      );


    return () => {

      mounted = false;

      authListener
        ?.subscription
        ?.unsubscribe();

    };

  }, []);


  const role =
    profile?.role ?? null;


  const isAdministrator =
    role === "administrator";


  const isSecurityOfficer =
    role === "security_officer";


  const isEmployee =
    role === "employee";


  return (

    <AuthContext.Provider
      value={{

        user,

        profile,

        role,

        loading,

        authError,

        isAdministrator,

        isSecurityOfficer,

        isEmployee,

        signIn,

        signOut,

      }}
    >

      {children}

    </AuthContext.Provider>

  );
}


export function useAuth() {

  const context =
    useContext(
      AuthContext
    );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }


  return context;
}