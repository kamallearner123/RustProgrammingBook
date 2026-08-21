fn main() {
    let mut buff = Box::new([0;100]);
    buff[0] = 100;
    println!("buff = {:?}",buff);
    println!("buff len = {}", buff.len());
}
